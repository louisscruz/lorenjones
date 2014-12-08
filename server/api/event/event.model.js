'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  date: String,
  time: String,
  name: String,
  venue: String,
  city: String,
  center: String,
});

module.exports = mongoose.model('Event', EventSchema);
