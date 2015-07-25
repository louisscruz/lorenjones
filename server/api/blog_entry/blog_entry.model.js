'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlogEntrySchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('BlogEntry', BlogEntrySchema);