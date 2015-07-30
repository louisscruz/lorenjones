'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DefaultTrackSchema = new Schema({
  link: String,
  info: String,
  playlist_index: Number,
  active: Boolean
});

module.exports = mongoose.model('DefaultTrack', DefaultTrackSchema);
