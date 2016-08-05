var express = require('express');
var auth = new (require('./auth'))();
var render = new (require('./render'))();

var router = express.Router();

router.get('/', auth.onlyUser);
router.get('/login', auth.onlyAnon, render.page('page/login'));

module.exports = router;