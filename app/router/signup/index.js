var express = require('express');
var controller = require('./controller');


//redirecciona
var router = express.Router();
router.post('/', controller.signup);

module.exports = router;
