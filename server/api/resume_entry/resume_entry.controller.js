'use strict';

var _ = require('lodash');
var ResumeEntry = require('./resume_entry.model');

// Get list of resume_entrys
exports.index = function(req, res) {
  ResumeEntry.find(function (err, resume_entrys) {
    if(err) { return handleError(res, err); }
    return res.json(200, resume_entrys);
  });
};

// Get a single resume_entry
exports.show = function(req, res) {
  ResumeEntry.findById(req.params.id, function (err, resume_entry) {
    if(err) { return handleError(res, err); }
    if(!resume_entry) { return res.send(404); }
    return res.json(resume_entry);
  });
};

// Creates a new resume_entry in the DB.
exports.create = function(req, res) {
  ResumeEntry.create(req.body, function(err, resume_entry) {
    if(err) { return handleError(res, err); }
    return res.json(201, resume_entry);
  });
};

// Updates an existing resume_entry in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ResumeEntry.findById(req.params.id, function (err, resume_entry) {
    if (err) { return handleError(res, err); }
    if(!resume_entry) { return res.send(404); }
    var updated = _.merge(resume_entry, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, resume_entry);
    });
  });
};

// Deletes a resume_entry from the DB.
exports.destroy = function(req, res) {
  ResumeEntry.findById(req.params.id, function (err, resume_entry) {
    if(err) { return handleError(res, err); }
    if(!resume_entry) { return res.send(404); }
    resume_entry.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}