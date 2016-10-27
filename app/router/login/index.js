var express = require('express');
var controller = require('./controller');

//redirecciona
var router = express.Router();
router.post('/', controller.login);
router.post('/session', controller.session);

module.exports = router;
