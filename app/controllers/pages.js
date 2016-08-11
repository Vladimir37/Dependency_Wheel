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

    admin(req, res, next) {
        files.readList().then(function (files) {
            res.render('page/admin.ejs', {
                docs: files
            });
        });
    }

    list(req, res, next) {
        var id = req.params.id;
        files.read(req, res).then(function (doc) {
            doc = JSON.stringify(doc);
            res.render('page/list.ejs', {
                file: doc,
                id: id
            });
        });
    }

    full(req, res, next) {
        var id = req.params.id;
        files.read(req, res).then(function (doc) {
            doc = JSON.stringify(doc);
            res.render('page/full.ejs', {
                file: doc,
                id: id
            });
        });
    }
}

module.exports = Pages;