'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WorkSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: Number,
  instrumentation: String,
  info: String,
  link: String,
  audio: String,
  video: String,
  active: Boolean
});

module.exports = mongoose.model('Work', WorkSchema);
