'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  title: String,
  datetime: Date,
  venue: String,
  address: String,
  lat: String,
  lng: String,
  city: String,
  link: String,
  info: String,
  center: String,
  zoom: Number
});

module.exports = mongoose.model('Event', EventSchema);
