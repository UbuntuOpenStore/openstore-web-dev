var db = require('../db');
var config = require('./config');
var logger = require('./logger');
var request = require('request');
var parse = require('click-parser');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');

function updateInfo(pkg, data, body, file, url) {
    if (data) {
        var manifest = {
            architecture: data.architecture,
            changelog: data.changelog,
            description: data.description,
            framework: data.framework,
            hooks: {},
            maintainer: data.maintainer,
            name: data.name,
            title: data.title,
            version: data.version,
        };

        data.apps.forEach(function(app) {
            var hook = {};

            if (Object.keys(app.apparmor).length > 0) {
                hook.apparmor = app.apparmor;
            }

            if (Object.keys(app.desktop).length > 0) {
                hook.desktop = app.desktop;
            }

            if (Object.keys(app.contentHub).length > 0) {
                hook['content-hub'] = app.contentHub;
            }

            if (Object.keys(app.urlDispatcher).length > 0) {
                hook.urls = app.urlDispatcher;
            }

            if (Object.keys(app.accountService).length > 0) {
                hook['account-application'] = app.accountService;
            }

            if (Object.keys(app.accountApplication).length > 0) {
                hook['account-service'] = app.accountApplication;
            }

            if (Object.keys(app.pushHelper).length > 0) {
                hook['push-helper'] = app.pushHelper;
            }

            if (Object.keys(app.webappProperties).length > 0) {
                hook['webapp-properties'] = app.webappProperties;
            }

            if (Object.keys(app.scopeIni).length > 0) {
                hook.scope = app.scopeIni;
            }

            manifest.hooks[app.name] = hook;
        });

        pkg.architecture = data.architecture;
        pkg.architectures = data.architecture;
        pkg.author = data.maintainer;
        pkg.framework = data.framework;
        pkg.id = data.name;
        pkg.manifest = manifest;
        pkg.name = data.title;
        pkg.types = data.types;
        pkg.version = data.version;
        pkg.snappy_meta = data.snappy_meta;

        //Don't overwrite the description if it already exists
        pkg.description = pkg.description ? pkg.description : data.description;

        //Don't overwrite the tagline if it already exists
        pkg.tagline = pkg.tagline ? pkg.tagline : data.description;
    }

    if (file && file.size) {
        pkg.filesize = file.size;
    }

    if (url) {
        pkg.package = url;
    }

    if (body) {
        if (body.published !== undefined) {
            pkg.published = (body.published == 'true');
        }

        if (body.category || body.category === '') {
            pkg.category = body.category;
        }

        if (body.changelog || body.changelog === '') {
            pkg.changelog = body.changelog;
        }

        if (body.description || body.description === '') {
            pkg.description = body.description;
        }

        if (body.license || body.license === '') {
            pkg.license = body.license;
        }

        if (body.source || body.source === '') {
            pkg.source = body.source;
        }

        if (body.tagline || body.tagline === '') {
            pkg.tagline = body.tagline;
        }

        if (body.screenshots) {
            pkg.screenshots = body.screenshots;
        }
        else {
            pkg.screenshots = [];
        }

        pkg.description = pkg.description ? pkg.description : '';
        pkg.changelog = pkg.changelog ? pkg.changelog : '';
        pkg.tagline = pkg.tagline ? pkg.tagline : '';

        pkg.description = sanitizeHtml(pkg.description, {
          allowedTags: [],
          allowedAttributes: [],
        }).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\r/g, '');

        pkg.changelog = sanitizeHtml(pkg.changelog, {
          allowedTags: [],
          allowedAttributes: [],
        }).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\r/g, '');

        pkg.tagline = sanitizeHtml(pkg.tagline, {
          allowedTags: [],
          allowedAttributes: [],
        }).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\r/g, '');

        if (body.maintainer !== undefined) {
            pkg.maintainer = body.maintainer;

            /*db.User.findOne({_id: pkg.maintainer}, function(err, user) {
                if (err) {
                    logger.error(err);
                    pkg.maintainer_name = '';
                }
                else {
                    pkg.maintainer_name = user.name;
                }

                callback(pkg);
            })*/
        }
        /*else {
            callback(pkg);
        }*/
    }
    else {
        pkg.description = pkg.description ? pkg.description : '';
        pkg.changelog = pkg.changelog ? pkg.changelog : '';
        pkg.tagline = pkg.tagline ? pkg.tagline : '';

        pkg.description = sanitizeHtml(pkg.description, {
          allowedTags: [],
          allowedAttributes: [],
        }).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\r/g, '');

        pkg.changelog = sanitizeHtml(pkg.changelog, {
          allowedTags: [],
          allowedAttributes: [],
        }).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\r/g, '');

        pkg.tagline = sanitizeHtml(pkg.tagline, {
          allowedTags: [],
          allowedAttributes: [],
        }).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\r/g, '');

        //callback(pkg);
    }

    return pkg;
}

function reparse() {
    db.Package.find({'$or': [{deleted: false}, {deleted: {'$exists': false}}]}, function(err, pkgs) {
        if (err) {
            logger.error(err);
        }
        else {
            pkgs.forEach(function(pkg) {
                var r = request(pkg.package);
                r.on('error', function(err) {
                    logger.error(pkg.id + ': ' + err);
                })
                .on('response', function(response) {
                    if (response.statusCode == 200) {
                        var filename = '/tmp/' + pkg.id + '.click';
                        var f = fs.createWriteStream(filename);
                        f.on('error', function(err) {
                            logger.error(pkg.id + ': ' + err);
                        })
                        .on('finish', function() {
                            parse(filename, function(err, data) {
                                fs.unlink(filename);
                                if (err) {
                                    logger.error(pkg.id + ': ' + err);
                                }
                                else {
                                    updateInfo(pkg, data);
                                    pkg.save(function(err) {
                                        if (err) {
                                            logger.error(pkg.id + ': ' + err);
                                        }
                                        else {
                                            logger.debug(pkg.id + ': success!');
                                        }
                                    });
                                }
                            });
                        });

                        r.pipe(f);
                    }
                    else {
                        logger.error(pkg.id + ': http error ' + response.statusCode);
                    }
                });
            });
        }
    });
}

function toJson(pkg, req) {
    var extension = '.click';
    if (pkg.types.indexOf('snappy') >= 0) {
        extension = '.snap';
    }
    var download =  config.server.host + '/api/download/' + pkg.id + '/' + pkg.id + '_' + pkg.version + '_' + pkg.architecture + extension;

    var json = {
        architecture: pkg.architecture ? pkg.architecture : '',
        architectures: pkg.architectures ? pkg.architectures : [],
        author: pkg.author ? pkg.author : '',
        category: pkg.category ? pkg.category : '',
        changelog: pkg.changelog ? pkg.changelog : '',
        description: pkg.description ? pkg.description : '',
        download_sha512: pkg.download_sha512 ? pkg.download_sha512 : '',
        download: download,
        filesize: pkg.filesize ? pkg.filesize : 0,
        framework: pkg.framework ? pkg.framework : '',
        icon: `${config.server.host}/api/icon/${pkg.version}/${pkg.id}.png`,
        id: pkg.id ? pkg.id : '',
        license: pkg.license ? pkg.license : '',
        maintainer_name: pkg.maintainer_name ? pkg.maintainer_name : '',
        manifest: pkg.manifest ? pkg.manifest : {},
        name: pkg.name ? pkg.name : '',
        package: pkg.package ? pkg.package : '',
        permissions: pkg.permissions ? pkg.permissions: [],
        published: !!pkg.published,
        screenshots: pkg.screenshots ? pkg.screenshots : [],
        snappy_meta: pkg.snappy_meta ? pkg.snappy_meta : {},
        source: pkg.source ? pkg.source : '',
        tagline: pkg.tagline ? pkg.tagline : '',
        types: pkg.types ? pkg.types : [],
        version: pkg.version ? pkg.version : '',
    };

    if (req.isAuthenticated() && req.user && req.user._id == pkg.maintainer) {
        if (req.user.role == 'admin' || req.user.role == 'trusted') {
            json.maintainer = pkg.maintainer ? pkg.maintainer : null;
        }

        json.downloads = pkg.downloads;
        json.totalDownloads = 0;

        if (pkg.downloads) {
            for (var version in pkg.downloads) {
                json.totalDownloads += pkg.downloads[version] ? pkg.downloads[version] : 0;
            }
        }
    }

    return json;
}

exports.updateInfo = updateInfo;
exports.reparse = reparse;
exports.toJson = toJson;
