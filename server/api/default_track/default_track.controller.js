'use strict';

var _ = require('lodash');
var DefaultTrack = require('./default_track.model');

// Get list of default_tracks
exports.index = function(req, res) {
  DefaultTrack.find(function (err, default_tracks) {
    if(err) { return handleError(res, err); }
    return res.json(200, default_tracks);
  });
};

// Get a single default_track
exports.show = function(req, res) {
  DefaultTrack.findById(req.params.id, function (err, default_track) {
    if(err) { return handleError(res, err); }
    if(!default_track) { return res.send(404); }
    return res.json(default_track);
  });
};

// Creates a new default_track in the DB.
exports.create = function(req, res) {
  DefaultTrack.create(req.body, function(err, default_track) {
    if(err) { return handleError(res, err); }
    return res.json(201, default_track);
  });
};

// Updates an existing default_track in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DefaultTrack.findById(req.params.id, function (err, default_track) {
    if (err) { return handleError(res, err); }
    if(!default_track) { return res.send(404); }
    var updated = _.merge(default_track, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, default_track);
    });
  });
};

// Deletes a default_track from the DB.
exports.destroy = function(req, res) {
  DefaultTrack.findById(req.params.id, function (err, default_track) {
    if(err) { return handleError(res, err); }
    if(!default_track) { return res.send(404); }
    default_track.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}