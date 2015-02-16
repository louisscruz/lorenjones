'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: String,
  date: String,
  time: String,
  venue: String,
  city: String,
  center: String
});

module.exports = mongoose.model('Event', EventSchema);
