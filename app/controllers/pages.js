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

    list(req, res, next) {
        files.read(req).then(function (doc) {
            doc = JSON.stringify(doc);
            res.render('page/list.ejs', {
                file: doc
            });
        });
    }

    full(req, res, next) {
        files.read(req).then(function (doc) {
            doc = JSON.stringify(doc);
            res.render('page/full.ejs', {
                file: doc
            });
        });
    }
}

module.exports = Pages;