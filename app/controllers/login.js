'use strict';

var passport = require('passport');

class Login {
    login(req, res, next) {
        passport.authenticate('local', function(err, user) {
            req.logIn(user, function(err) {
                if (err) {
                    console.log(err);
                    return res.redirect('/login#incorrect');
                }
                else {
                    return res.redirect('/admin');
                }
            });
        })(req, res, next);
    }
}

module.exports = Login;