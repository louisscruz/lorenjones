'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BioEntrySchema = new Schema({
  title: String,
  content: String,
  active: Boolean
});

module.exports = mongoose.model('BioEntry', BioEntrySchema);
