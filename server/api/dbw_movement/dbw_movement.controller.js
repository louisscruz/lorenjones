'use strict';

var _ = require('lodash');
var DbwMovement = require('./dbw_movement.model');

// Get list of dbw_movements
exports.index = function(req, res) {
  DbwMovement.find(function (err, dbw_movements) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(dbw_movements);
  });
};

// Get a single dbw_movement
exports.show = function(req, res) {
  DbwMovement.findById(req.params.id, function (err, dbw_movement) {
    if(err) { return handleError(res, err); }
    if(!dbw_movement) { return res.status(404).send('Not Found'); }
    return res.json(dbw_movement);
  });
};

// Creates a new dbw_movement in the DB.
exports.create = function(req, res) {
  DbwMovement.create(req.body, function(err, dbw_movement) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(dbw_movement);
  });
};

// Updates an existing dbw_movement in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DbwMovement.findById(req.params.id, function (err, dbw_movement) {
    if (err) { return handleError(res, err); }
    if(!dbw_movement) { return res.status(404).send('Not Found'); }
    var updated = _.merge(dbw_movement, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(dbw_movement);
    });
  });
};

// Deletes a dbw_movement from the DB.
exports.destroy = function(req, res) {
  DbwMovement.findById(req.params.id, function (err, dbw_movement) {
    if(err) { return handleError(res, err); }
    if(!dbw_movement) { return res.status(404).send('Not Found'); }
    dbw_movement.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}