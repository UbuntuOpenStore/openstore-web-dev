const passport = require('passport');
const multer = require('multer');
const path = require('path');
const uuid = require('node-uuid');
const express = require('express');

const Package = require('../db/package/model');
const PackageRepo = require('../db/package/repo');
const PackageSearch = require('../db/package/search');
const config = require('../utils/config');
const packages = require('../utils/packages');
const logger = require('../utils/logger');
const helpers = require('../utils/helpers');
const upload = require('../utils/upload');
const clickParse = require('../utils/click-parser-async');
const checksum = require('../utils/checksum');
const reviewPackage = require('../utils/review-package');
const fs = require('../utils/asyncFs');

const mupload = multer({dest: '/tmp'});
const router = express.Router();

// TODO translate these errors
const APP_NOT_FOUND = 'App not found';
const NEEDS_MANUAL_REVIEW = 'This app needs to be reviewed manually';
const MALFORMED_MANIFEST = 'Your package manifest is malformed';
const DUPLICATE_PACKAGE = 'A package with the same name already exists';
const PERMISSION_DENIED = 'You do not have permission to update this app';
const BAD_FILE = 'The file must be a click package';
const WRONG_PACKAGE = 'The uploaded package does not match the name of the package you are editing';
const BAD_NAMESPACE = 'You package name is for a domain that you do not have access to';
const EXISTING_VERSION = 'A revision already exists with this version';
const NO_FILE = 'No file upload specified';
const INVALID_CHANNEL = 'The provided channel is not valid';
const NO_REVISIONS = 'You cannot publish your package until you upload a revision';
const NO_APP_NAME = 'No app name specified';
const NO_APP_TITLE = 'No app title specified';
const APP_HAS_REVISIONS = 'Cannot delete an app that already has revisions';

function fileName(file) {
    // Rename the file so click-review doesn't freak out
    return `${file.path}.click`;
}

async function review(req, file, filePath) {
    if (!file.originalname.endsWith('.click')) {
        fs.unlink(file.path);
        return [false, BAD_FILE];
    }

    await fs.renameAsync(file.path, filePath);

    if (!helpers.isAdminOrTrustedUser(req)) {
        // Admin & trusted users can upload apps without manual review
        let needsManualReview = await reviewPackage(filePath);
        if (needsManualReview) {
            // TODO improve this feedback
            let error = NEEDS_MANUAL_REVIEW;
            if (needsManualReview === true) {
                error = `${NEEDS_MANUAL_REVIEW}, please check you app using the click-review command`;
            }
            else {
                error = `${NEEDS_MANUAL_REVIEW} (Error: ${needsManualReview})`;
            }

            fs.unlink(filePath);
            return [false, error];
        }
    }

    return [true, null];
}

function updateScreenshotFiles(pkg, screenshotFiles) {
    let screenshotLimit = 5 - pkg.screenshots.length;
    if (screenshotFiles.length < screenshotLimit) {
        screenshotLimit = screenshotFiles.length;
    }

    if (screenshotFiles.length > screenshotLimit) {
        for (let i = screenshotLimit; i < screenshotFiles.length; i++) {
            fs.unlink(screenshotFiles[i].path);
        }
    }

    for (let i = 0; i < screenshotLimit; i++) {
        let file = screenshotFiles[i];

        let ext = path.extname(file.originalname);
        if (['.png', '.jpg', '.jpeg'].indexOf(ext) == -1) {
            // Reject anything not an image we support
            fs.unlink(file.path);
        }
        else {
            let id = uuid.v4();
            let filename = `${pkg.id}-screenshot-${id}${ext}`;

            fs.renameSync(
                screenshotFiles[i].path,
                `${config.image_dir}/${filename}`,
            );

            pkg.screenshots.push(`${config.server.host}/api/screenshot/${filename}`);
        }
    }

    return pkg;
}

router.get('/', passport.authenticate('localapikey', {session: false}), (req, res) => {
    let defaultQuery = null;
    if (helpers.isAdminUser(req)) {
        defaultQuery = {};
    }
    else {
        /* eslint-disable no-underscore-dangle */
        defaultQuery = {maintainer: req.user._id};
    }

    let filters = packages.parseFiltersFromRequest(req);
    PackageRepo.queryPackages(filters, defaultQuery).then((results) => {
        let pkgs = results[0];
        let count = results[1];

        let formatted = [];
        pkgs.forEach((pkg) => {
            formatted.push(packages.toJson(pkg, req));
        });

        if (req.originalUrl.substring(0, 19) == '/api/v1/manage/apps') {
            helpers.success(res, formatted);
        }
        else {
            let links = helpers.nextPreviousLinks(req, formatted.length);

            helpers.success(res, {
                count: count,
                packages: formatted,
                next: links.next,
                previous: links.previous,
            });
        }
    }).catch((err) => {
        logger.error('Error fetching packages:', err);
        console.error(err);
        helpers.error(res, 'Could not fetch app list at this time');
    });
});

router.get('/:id', passport.authenticate('localapikey', {session: false}), (req, res) => {
    let query = null;
    if (helpers.isAdminUser(req)) {
        query = Package.findOne({id: req.params.id});
    }
    else {
        query = Package.findOne({id: req.params.id, maintainer: req.user._id});
    }

    query.then((pkg) => {
        helpers.success(res, packages.toJson(pkg, req));
    }).catch(() => {
        helpers.error(res, APP_NOT_FOUND, 404);
    });
});

router.post(
    '/',
    passport.authenticate('localapikey', {session: false}),
    helpers.isNotDisabled,
    helpers.downloadFileMiddleware,
    async (req, res) => {
        let name = req.body.name.trim();
        let id = req.body.id.toLowerCase().trim();

        if (!id) {
            return helpers.error(res, NO_APP_NAME, 400);
        }

        if (!name) {
            return helpers.error(res, NO_APP_TITLE, 400);
        }

        try {
            let existing = await Package.findOne({id: id}).exec();
            if (existing) {
                return helpers.error(res, DUPLICATE_PACKAGE, 400);
            }

            if (!helpers.isAdminOrTrustedUser(req)) {
                if (id.startsWith('com.ubuntu.') && !id.startsWith('com.ubuntu.developer.')) {
                    return helpers.error(res, BAD_NAMESPACE, 400);
                }
                if (id.startsWith('com.canonical.')) {
                    return helpers.error(res, BAD_NAMESPACE, 400);
                }
                if (id.includes('ubports')) {
                    return helpers.error(res, BAD_NAMESPACE, 400);
                }
                if (id.includes('openstore')) {
                    return helpers.error(res, BAD_NAMESPACE, 400);
                }
            }

            let pkg = new Package();
            pkg.id = id;
            pkg.name = name;
            pkg.maintainer = req.user._id;
            pkg.maintainer_name = req.user.name ? req.user.name : req.user.username;
            pkg = await pkg.save();

            return helpers.success(res, packages.toJson(pkg, req));
        }
        catch (err) {
            logger.error('Error parsing new package:', err);
            return helpers.error(res, 'There was an error creating your app, please try again later');
        }
    },
);

let putUpload = mupload.fields([
    {name: 'screenshot_files', maxCount: 5},
]);

router.put(
    '/:id',
    passport.authenticate('localapikey', {session: false}),
    putUpload,
    helpers.isNotDisabled,
    async(req, res) => {
        try {
            if (req.body && (!req.body.maintainer || req.body.maintainer == 'null')) {
                req.body.maintainer = req.user._id;
            }

            let pkg = await Package.findOne({id: req.params.id}).exec();
            if (!pkg) {
                return helpers.error(res, APP_NOT_FOUND, 404);
            }

            if (!helpers.isAdminUser(req) && req.user._id != pkg.maintainer) {
                return helpers.error(res, PERMISSION_DENIED, 400);
            }

            let published = (req.body.published == 'true' || req.body.published === true);
            if (published && pkg.revisions.length == 0) {
                return helpers.error(res, NO_REVISIONS, 400);
            }

            pkg = await packages.updateInfo(pkg, null, req.body, null, null, false);

            if (req.files && req.files.screenshot_files && req.files.screenshot_files.length > 0) {
                pkg = updateScreenshotFiles(pkg, req.files.screenshot_files);
            }

            pkg = await pkg.save();

            if (pkg.published) {
                await PackageSearch.upsert(pkg);
            }
            else {
                await PackageSearch.remove(pkg);
            }

            return helpers.success(res, packages.toJson(pkg, req));
        }
        catch (err) {
            let message = err.message ? err.message : err;
            logger.error('Error updating package:', message);

            if (err.response) {
                logger.error('Response data');
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            }
            else if (err.request) {
                logger.error('Request data (no response received)');
                console.log(err.request);
            }

            return helpers.error(res, 'There was an error updating your app, please try again later');
        }
    },
);

router.delete(
    '/:id',
    passport.authenticate('localapikey', {session: false}),
    helpers.isNotDisabled,
    async(req, res) => {
        try {
            let pkg = await Package.findOne({id: req.params.id}).exec();
            if (!pkg) {
                return helpers.error(res, APP_NOT_FOUND, 404);
            }

            if (!helpers.isAdminUser(req) && req.user._id != pkg.maintainer) {
                return helpers.error(res, PERMISSION_DENIED, 400);
            }

            if (pkg.revisions.length > 0) {
                return helpers.error(res, APP_HAS_REVISIONS, 400);
            }

            await pkg.remove();
            return helpers.success(res, {});
        }
        catch (err) {
            console.log(err);
            logger.error('Error deleting package:', err);
            return helpers.error(res, 'There was an error deleting your app, please try again later');
        }
    },
);

let postUpload = mupload.fields([
    {name: 'file', maxCount: 1},
]);

router.post(
    '/:id/revision',
    passport.authenticate('localapikey', {session: false}),
    postUpload,
    helpers.isNotDisabled,
    helpers.downloadFileMiddleware,
    async(req, res) => {
        if (!req.files || !req.files.file || !req.files.file.length == 1) {
            return helpers.error(res, NO_FILE, 400);
        }

        let channel = req.body.channel ? req.body.channel.toLowerCase() : '';
        if (!Package.CHANNELS.includes(channel)) {
            return helpers.error(res, INVALID_CHANNEL, 400);
        }

        // TODO remove this when vivid gets removed from Package.CHANNELS
        if (channel != Package.XENIAL) {
            return helpers.error(res, INVALID_CHANNEL, 400);
        }

        try {
            let pkg = await Package.findOne({id: req.params.id}).exec();
            if (!pkg) {
                return helpers.error(res, APP_NOT_FOUND, 404);
            }

            let previousRevision = pkg.xenial_revision;

            if (!helpers.isAdminUser(req) && req.user._id != pkg.maintainer) {
                return helpers.error(res, PERMISSION_DENIED, 400);
            }

            let success;
            let error;
            let filePath = fileName(req.files.file[0]);
            [success, error] = await review(req, req.files.file[0], filePath);
            if (!success) {
                return helpers.error(res, error, 400);
            }

            let parseData = await clickParse(filePath, true);
            if (!parseData.name || !parseData.version || !parseData.architecture) {
                return helpers.error(res, MALFORMED_MANIFEST, 400);
            }

            if (pkg.id && parseData.name != pkg.id) {
                return helpers.error(res, WRONG_PACKAGE, 400);
            }

            if (pkg.id && pkg.revisions) {
                // Check for existing revisions (for this channel) with the same version string

                /* eslint-disable arrow-body-style */
                let matches = pkg.revisions.filter((revision) => {
                    return (revision.version == parseData.version && revision.channel == channel);
                });
                if (matches.length > 0) {
                    return helpers.error(res, EXISTING_VERSION, 400);
                }
            }

            // Only update the data from the parsed click if it's for XENIAL or if it's the first one
            let data = (channel == Package.XENIAL || pkg.revisions.length === 0) ? parseData : null;
            let downloadSha512 = await checksum(filePath);
            pkg = await packages.updateInfo(pkg, data, null, req.files.file[0], null, true, channel, parseData.version, downloadSha512);

            let updateIcon = (channel == Package.XENIAL || !pkg.icon);
            let icon = updateIcon ? parseData.icon : null;

            let packageUrl;
            let iconUrl;
            [packageUrl, iconUrl] = await upload.uploadPackage(
                pkg,
                filePath,
                icon,
                channel,
                parseData.version,
            );

            let revision = pkg.xenial_revision;
            if (updateIcon) {
                pkg.icon = iconUrl;
            }

            if (req.body.changelog) {
                pkg.changelog = packages.sanitize(`${req.body.changelog}\n\n${pkg.changelog}`);
            }

            if (!pkg.channels.includes(channel)) {
                pkg.channels.push(channel);
            }

            for (let i = 0; i < pkg.revisions.length; i++) {
                let revisionData = pkg.revisions[i];
                if (revisionData.channel == channel) {
                    if (revisionData.revision == revision) {
                        revisionData.download_url = packageUrl;
                    }

                    if (revisionData.revision == previousRevision) {
                        await upload.removeFile(revisionData.download_url);
                    }
                }
            }

            pkg = await pkg.save();

            if (pkg.published) {
                await PackageSearch.upsert(pkg);
            }

            return helpers.success(res, packages.toJson(pkg, req));
        }
        catch (err) {
            let message = err.message ? err.message : err;
            logger.error(`Error updating package: ${message}`);

            if (err.response) {
                logger.info('Response data');
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            }
            else if (err.request) {
                logger.info('Request data (no response received)');
                console.log(err.request);
            }

            return helpers.error(res, 'There was an error updating your app, please try again later');
        }
    },
);

module.exports = router;
