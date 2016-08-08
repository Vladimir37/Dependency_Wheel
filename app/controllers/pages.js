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

    chart(req, res, next) {
        files.read().then(function (file) {
            file = JSON.stringify(file);
            res.render('page/chart.ejs', {
                file: file
            });
        });
    }
}

module.exports = Pages;