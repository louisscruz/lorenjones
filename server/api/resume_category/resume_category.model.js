'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResumeCategorySchema = new Schema({
  name: String
});

module.exports = mongoose.model('ResumeCategory', ResumeCategorySchema);
