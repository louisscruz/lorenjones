'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResumeEntrySchema = new Schema({
  title: String,
  field1: String,
  field2: String,
  field3: String,
  field4: String,
  field5: String,
  category: String
});

module.exports = mongoose.model('ResumeEntry', ResumeEntrySchema);
