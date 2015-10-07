'use strict';

var express = require('express');
var controller = require('./playlist.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.show);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
