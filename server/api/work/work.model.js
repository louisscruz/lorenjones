'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WorkSchema = new Schema({
  title: String,
  category: String,
  date: Number,
  score: String,
  audio: String,
  active: Boolean
});

module.exports = mongoose.model('Work', WorkSchema);
