const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('cookie-session');
const express = require('express');
const cluster = require('cluster');
const path = require('path');

const config = require('../utils/config');
const apps = require('./apps');
const manage = require('./manage');
const categories = require('./categories');
const discover = require('./discover');
const revisions = require('./revisions');
const auth = require('./auth');
const users = require('./users');
const rss = require('./rss');
const db = require('../db');
const Package = require('../db/package/model');
const PackageRepo = require('../db/package/repo');
const opengraph = require('../utils/opengraph');
const logger = require('../utils/logger');
const helpers = require('../utils/helpers');
const fs = require('../utils/asyncFs');

const APP_NOT_FOUND = 'App not found';

function setup() {
    const app = express();
    app.disable('x-powered-by');

    app.use((req, res, next) => {
        // Setup cors
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.use((req, res, next) => {
        if (process.env.NODE_ENV == 'production') {
            // Redirect to the main domain
            let host = config.server.host.replace('https://', '').replace('http://', '');
            if (req.headers.host != host) {
                res.redirect(301, config.server.host + req.originalUrl);
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    });

    app.use((req, res, next) => {
        req.apiVersion = 2;
        if (req.originalUrl.startsWith('/api/v3')) {
            req.apiVersion = 3;
        }

        next();
    });

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(session({
        secret: config.server.session_secret,
        name: 'opensession',
        maxAge: 604800000, // 7 days in miliseconds
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // TODO remove this
    app.use('/api/screenshot', apps.screenshot);

    app.use('/auth', auth);
    app.use('/api/users', users);
    app.use('/rss', rss);

    app.use('/api/v3/apps', apps.main);
    app.use('/api/v3/stats', apps.stats);
    app.use('/api/v3/manage', manage);
    app.use('/api/v3/discover', discover);
    app.use('/api/v3/revisions', revisions);
    app.use('/api/v3/categories', categories);

    app.use(express.static(config.server.static_root));

    app.get('/api/health', (req, res) => {
        helpers.success(res, {id: cluster.worker.id});
    });

    app.get('/telegram', (req, res) => {
        // Short link
        res.redirect(301, 'https://t.me/joinchat/Bd_29FDzIzwgGgsuTXSwmw');
    });

    app.get('/app/openstore.mzanetti', (req, res) => {
        // Redirect old app name
        res.redirect(301, `${config.server.host}/app/openstore.openstore-team`);
    });

    app.get('/manage/create', (req, res) => {
        // Redirect old create page
        res.redirect(301, `${config.server.host}/submit`);
    });

    app.get('/docs', (req, res) => {
        // Redirect docs page to the about page
        // Using a 302 because the docs page may come back in the future
        res.redirect(302, `${config.server.host}/about`);
    });

    app.get('/app/:name', async (req, res) => {
        /*
        For populating opengraph data, etc for bots that don't
        execute javascript (like twitter cards)
        */

        if (opengraph.match(req)) {
            try {
                let pkg = await PackageRepo.findOne({id: req.params.name}, {});

                if (!pkg) {
                    res.status(404);
                    return res.send();
                }

                let data = await fs.readFileAsync(path.join(config.server.static_root, 'index.html'), {encoding: 'utf8'});

                res.header('Content-Type', 'text/html');
                res.status(200);
                res.send(opengraph.replace(data, {
                    title: pkg.name,
                    url: `${config.server.host}/app/${pkg.id}`,
                    image: pkg.icon,
                    description: pkg.tagline ? pkg.tagline : '',
                }));
            }
            catch (err) {
                res.status(500);
                res.send();
            }
        }
        else {
            res.sendFile('index.html', {root: config.server.static_root});
        }
    });

    app.all([
        '/',
        '/submit',
        '/apps',
        '/app/:name',
        '/users',
        '/manage',
        '/manage/:name',
        '/manage/:name/revision',
        '/login',
        '/stats',
        '/about',
        '/feeds',
    ], (req, res) => {
        // For html5mode on frontend
        res.sendFile('index.html', {root: config.server.static_root});
    });

    app.listen(config.server.port, config.server.ip);
    logger.debug(`listening on ${config.server.ip}:${config.server.port}`);

    return app;
}

module.exports.setup = setup;
