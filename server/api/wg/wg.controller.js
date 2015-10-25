'use strict';

var _ = require('lodash');
var Wg = require('./wg.model');

// Get list of wgs
exports.index = function(req, res) {
  Wg.find(function (err, wgs) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(wgs);
  });
};

// Get a single wg
exports.show = function(req, res) {
  Wg.findById(req.params.id, function (err, wg) {
    if(err) { return handleError(res, err); }
    if(!wg) { return res.status(404).send('Not Found'); }
    return res.json(wg);
  });
};

// Creates a new wg in the DB.
exports.create = function(req, res) {
  Wg.create(req.body, function(err, wg) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(wg);
  });
};

// Updates an existing wg in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Wg.findById(req.params.id, function (err, wg) {
    if (err) { return handleError(res, err); }
    if(!wg) { return res.status(404).send('Not Found'); }
    var updated = _.merge(wg, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(wg);
    });
  });
};

// Deletes a wg from the DB.
exports.destroy = function(req, res) {
  Wg.findById(req.params.id, function (err, wg) {
    if(err) { return handleError(res, err); }
    if(!wg) { return res.status(404).send('Not Found'); }
    wg.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}