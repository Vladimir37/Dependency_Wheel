'use strict';

var files = new (require('./files'))();

class Pages {
    index(req, res, next) {
        files.readList().then(function (files) {
            res.render('page/index.ejs', {
                docs: files
            });
        });
    }
}

module.exports = Pages;