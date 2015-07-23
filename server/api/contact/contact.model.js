'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactSchema = new Schema({

});

module.exports = mongoose.model('Contact', ContactSchema);
