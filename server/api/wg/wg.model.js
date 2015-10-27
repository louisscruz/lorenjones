'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WgSchema = new Schema({
  title: String,
  url: String
});

module.exports = mongoose.model('Wg', WgSchema);
