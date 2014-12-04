'use strict';

var _ = require('lodash');
var Work = require('./work.model');

// Get list of works
exports.index = function(req, res) {
  Work.find(function (err, works) {
    if(err) { return handleError(res, err); }
    return res.json(200, works);
  });
};

// Get a single work
exports.show = function(req, res) {
  Work.findById(req.params.id, function (err, work) {
    if(err) { return handleError(res, err); }
    if(!work) { return res.send(404); }
    return res.json(work);
  });
};

// Creates a new work in the DB.
exports.create = function(req, res) {
  Work.create(req.body, function(err, work) {
    if(err) { return handleError(res, err); }
    return res.json(201, work);
  });
};

// Updates an existing work in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Work.findById(req.params.id, function (err, work) {
    if (err) { return handleError(res, err); }
    if(!work) { return res.send(404); }
    var updated = _.merge(work, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, work);
    });
  });
};

// Deletes a work from the DB.
exports.destroy = function(req, res) {
  Work.findById(req.params.id, function (err, work) {
    if(err) { return handleError(res, err); }
    if(!work) { return res.send(404); }
    work.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}