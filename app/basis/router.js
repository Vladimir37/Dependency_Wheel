var express = require('express');
var auth = new (require('./auth'))();
var login = new (require('../controllers/login'))();
var files = new (require('../controllers/files'))();
var pages = new (require('../controllers/pages'))();
var render = new (require('./render'))();

var router = express.Router();

router.get('/', pages.index);
router.get('/admin', auth.onlyUser, pages.admin);
router.get('/login', auth.onlyAnon, render.page('page/login'));
router.get('/list/:id', pages.list);
router.get('/full/:id', pages.full);
router.get('/delete/:id', auth.onlyUser, files.delete.bind(files));

router.post('/login', auth.onlyAnon, login.login);
router.post('/upload', auth.onlyUser, files.upload.bind(files));

module.exports = router;