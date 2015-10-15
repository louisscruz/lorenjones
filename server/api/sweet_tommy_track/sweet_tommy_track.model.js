'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SweetTommyTrackSchema = new Schema({
  title: String,
  credit: String,
  url: String
});

module.exports = mongoose.model('SweetTommyTrack', SweetTommyTrackSchema);
