'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlaylistSchema = new Schema({
  order: [],
  active: Boolean
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
