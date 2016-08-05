var express = require('express');
var auth = new (require('./auth'))();
var login = new (require('../controllers/login'))();
var render = new (require('./render'))();

var router = express.Router();

router.get('/', auth.onlyUser, render.page('page/index'));
router.get('/login', auth.onlyAnon, render.page('page/login'));

router.post('/login', auth.onlyAnon, login.login);

module.exports = router;