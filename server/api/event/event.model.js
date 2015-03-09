'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: String,
  date: Date,
  time: String,
  venue: String,
  city: String,
  link: String,
  info: String,
  center: String,
  lat: String,
  lng: String,
  zoom: Number
});

module.exports = mongoose.model('Event', EventSchema);
