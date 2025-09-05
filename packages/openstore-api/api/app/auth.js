var config = require('../utils/config');
var db = require('../db');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('cookie-session');
var UbuntuStrategy = require('passport-ubuntu').Strategy;
var LocalAPIKeyStrategy = require('passport-localapikey').Strategy;
var uuid = require('node-uuid');

function setup(app) {
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(session({
    secret: config.server.session_secret,
        name: 'opensession',
        maxAge: 604800000 //7 days in miliseconds
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user.ubuntu_id);
    });

    passport.deserializeUser(function(identifier, done) {
        db.User.findOne({ubuntu_id: identifier}, done);
    });

    passport.use(new LocalAPIKeyStrategy(function(apikey, done) {
        db.User.findOne({apikey: apikey}, function(err, user) {
            if (err) {
                done(err);
            }
            else if (!user) {
                done(null, false);
            }
            else {
                done(null, user);
            }
        });
    }));

    passport.use(new UbuntuStrategy({
        returnURL: config.server.host + '/auth/ubuntu/return',
        realm: config.server.host,
        stateless: true,
    },
    function(identifier, profile, done) {
        db.User.findOne({ubuntu_id: identifier}, function(err, user) {
            if (err) {
                done(err);
            }
            else {
                var save = false;
                if (!user) {
                    user = new db.User();
                    user.apikey = uuid.v4();
                    user.ubuntu_id = identifier;
                    user.username = Math.random();
                    user.language = 'en';
                    save = true;
                }

                if (profile.fullname && profile.fullname != user.name) {
                    user.name = profile.fullname;
                    save = true;
                }

                if (profile.nickname && profile.nickname != user.username) {
                    user.username = profile.nickname;
                    save = true;
                }

                if (profile.email && profile.email != user.email) {
                    user.email = profile.email;
                    save = true;
                }

                if (profile.language && profile.language != user.language) {
                    user.language = profile.language;
                    save = true;
                }

                if (save) {
                    user.save(function(err) {
                        done(err, user);
                    });
                }
                else {
                    done(null, user);
                }
            }
        });
    }));

    app.post('/auth/ubuntu', passport.authenticate('ubuntu'));
    app.get('/auth/ubuntu/return', passport.authenticate('ubuntu', {
        successRedirect: '/manage',
        failureRedirect: '/'
    }));
    app.post('/auth/ubuntu/return', passport.authenticate('ubuntu', {
        successRedirect: '/manage',
        failureRedirect: '/'
    }));

    app.get('/auth/me', function(req, res) {
        if (req.user) {
            res.send({
                success: true,
                data: {
                    _id: req.user._id,
                    name: req.user.name,
                    language: req.user.language,
                    username: req.user.username,
                    apikey: req.user.apikey,
                    role: req.user.role,
                },
                message: null
            });
        }
        else {
            res.status(401);
            res.send({
                success: false,
                data: null,
                message: 'User not logged in'
            });
        }
    });

    app.get('/auth/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}

exports.setup = setup;
