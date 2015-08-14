'use strict';

var express = require('express');
var controller = require('./playlist.controller');

var router = express.Router();

router.get('/', controller.show);
//router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
