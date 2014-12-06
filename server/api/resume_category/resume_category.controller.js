'use strict';

var _ = require('lodash');
var ResumeCategory = require('./resume_category.model');

// Get list of resume_categorys
exports.index = function(req, res) {
  ResumeCategory.find(function (err, resume_categorys) {
    if(err) { return handleError(res, err); }
    return res.json(200, resume_categorys);
  });
};

// Get a single resume_category
exports.show = function(req, res) {
  ResumeCategory.findById(req.params.id, function (err, resume_category) {
    if(err) { return handleError(res, err); }
    if(!resume_category) { return res.send(404); }
    return res.json(resume_category);
  });
};

// Creates a new resume_category in the DB.
exports.create = function(req, res) {
  ResumeCategory.create(req.body, function(err, resume_category) {
    if(err) { return handleError(res, err); }
    return res.json(201, resume_category);
  });
};

// Updates an existing resume_category in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ResumeCategory.findById(req.params.id, function (err, resume_category) {
    if (err) { return handleError(res, err); }
    if(!resume_category) { return res.send(404); }
    var updated = _.merge(resume_category, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, resume_category);
    });
  });
};

// Deletes a resume_category from the DB.
exports.destroy = function(req, res) {
  ResumeCategory.findById(req.params.id, function (err, resume_category) {
    if(err) { return handleError(res, err); }
    if(!resume_category) { return res.send(404); }
    resume_category.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}