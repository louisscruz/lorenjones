'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DbwMovementSchema = new Schema({
  movement: Number,
  audio: String,
  active: Boolean
});

module.exports = mongoose.model('DbwMovement', DbwMovementSchema);
