'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WorkSchema = new Schema({
  title: String,
  category: String,
  date: Number,
  active: Boolean
});

module.exports = mongoose.model('Work', WorkSchema);
