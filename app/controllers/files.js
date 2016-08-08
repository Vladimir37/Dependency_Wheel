'use strict';

var formidable = require('formidable');
var xlsx = require("xlsx");
var fs = require('fs');

class Files {
    upload(req, res, next) {
        var self = this;
        var form = new formidable.IncomingForm();
        form.uploadDir = "app/files/temp";
        form.parse(req, function(err, fields, files) {
            if (err) {
                console.log(err);
                res.render('errors/e500.ejs');
            }
            var file = files.file;
            var name_arr = file.name.split('.');
            if (name_arr[name_arr.length - 1] != 'xlsx') {
                res.redirect('/#unfile');
                return false;
            }
            var xlsx_file = xlsx.readFile(file.path);
            var list_names = xlsx_file.SheetNames;
            var result_file = [];
            // Скопированный код с форматированием
            list_names.forEach(function(y) {
                var worksheet = xlsx_file.Sheets[y];
                var headers = {};
                var data = [];
                for(var z in worksheet) {
                    if (z[0] === '!') {
                        continue
                    };

                    // parse out the column, row, and value
                    var col = z.substring(0,1);
                    var row = parseInt(z.substring(1));
                    var value = worksheet[z].v;

                    // store header names
                    if (row == 1) {
                        headers[col] = value;
                        continue;
                    }

                    if (!data[row]) {
                        data[row]={};
                    };
                    data[row][headers[col]] = value;
                }
                // drop those first two rows which are empty
                data.shift();
                data.shift();
                result_file.push(data);
            });
            result_file.unshift(list_names);
            result_file = JSON.stringify(result_file, null, 4);
            fs.writeFile('app/files/data/' + fields.title + '.json', result_file, function (err) {
                if (err) {
                    console.log(err);
                    res.render('errors/e500.ejs');
                    return false;
                }
                res.redirect('/');
                fs.unlink(file.path);
                self._addToList(fields.title);
            });
        });
    }

    read(req, res, next) {
        var id = req.params.id;
        this._getDocName(id).then(function (name) {
            fs.readFile('app/files/data/' + name + '.json', 'utf8', function (err, response) {
                if (err) {
                    console.log(err);
                    res.render('errors/e500.ejs');
                    return false;
                }
                // if (typeof response == 'string') {
                //     response = JSON.parse(response);
                // }
                // response = JSON.stringify(response);
                res.render('page/chart.ejs', {
                    file: response
                });
            });
        }).catch(function (err) {
            console.log(err);
            res.render('errors/e500.ejs');
        });;
    }

    delete(req, res, next) {
        var self = this;
        var id = req.params.id;
        this._getDocName(id).then(function (name) {
            fs.unlink('app/files/data/' + name + '.json', function (err) {
                if (err) {
                    console.log(err);
                    res.render('errors/e500.ejs');
                    return false;
                }
                self._deleteFromList(id);
                res.redirect('/');
            }).catch(function (err) {
                console.log(err);
                res.render('errors/e500.ejs');
            });
        })
        
    }

    _getDocName(id) {
        return new Promise(function (resolve, reject) {
            fs.readFile('app/files/list.json', 'utf8', function (err, response) {
                if (err) {
                    console.log(err);
                    reject();
                }
                if (typeof response == 'string') {
                    response = JSON.parse(response);
                }
                resolve(response[id]);
            });
        });
    }

    _addToList(title) {
        fs.readFile('app/files/list.json', 'utf8', function (err, response) {
            if (err) {
                console.log(err);
                return false;
            }
            if (typeof response == 'string') {
                response = JSON.parse(response);
            }
            response.push(title);
            response = JSON.stringify(response);
            fs.writeFile('app/files/list.json', response, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    _deleteFromList(id) {
        fs.readFile('app/files/list.json', 'utf8', function (err, response) {
            if (err) {
                console.log(err);
                return false;
            }
            if (typeof response == 'string') {
                response = JSON.parse(response);
            }
            response.forEach(function (elem, i) {
                if (i == id) {
                    response.splice(i, 1);
                }
            })
            response = JSON.stringify(response);
            fs.writeFile('app/files/list.json', response, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    readList() {
        return new Promise(function (resolve, reject) {
            fs.readFile('app/files/list.json', 'utf8', function (err, response) {
                if (err) {
                    console.log(err);
                    reject();
                }
                if (typeof response == 'string') {
                    response = JSON.parse(response);
                }
                resolve(response);
            });
        });
    }
}

module.exports = Files;