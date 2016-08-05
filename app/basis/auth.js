'use strict';

var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');

class Authenticate {
    strategy() {
        return new LocalStrategy(function (username, password, done) {
            // Проверка имени админа и хэша пароля
            if (username == 'admin' && md5(password) == '2dc5b262c016950f92cbf6e0f18c92c1') {
                return done(null, {
                    name: 'admin'
                });
            }
            else {
                return done(null, false);
            }
        });
    }
    serialization(passport) {
        return passport.serializeUser(function(user, done) {
            done(null, user.name);
        });
    }
    deserialization(passport) {
        return passport.deserializeUser(function(name, done) {
            if (name == "admin") {
                done(null, {
                    name
                });
            }
            else {
                done('Incorrect user');
            }
        });
    }
    onlyUser(req, res, next) {
        if (req.user) {
            next();
        }
        else {
            res.redirect('/login');
        }
    }
    onlyAnon(req, res, next) {
        if (!req.user) {
            next();
        }
        else {
            res.redirect('/login');
        }
    }
}

module.exports = Authenticate;
