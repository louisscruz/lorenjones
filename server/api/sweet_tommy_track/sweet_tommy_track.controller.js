'use strict';

var _ = require('lodash');
var SweetTommyTrack = require('./sweet_tommy_track.model');

// Get list of sweet_tommy_tracks
exports.index = function(req, res) {
  SweetTommyTrack.find(function (err, sweet_tommy_tracks) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(sweet_tommy_tracks);
  });
};

// Get a single sweet_tommy_track
exports.show = function(req, res) {
  SweetTommyTrack.findById(req.params.id, function (err, sweet_tommy_track) {
    if(err) { return handleError(res, err); }
    if(!sweet_tommy_track) { return res.status(404).send('Not Found'); }
    return res.json(sweet_tommy_track);
  });
};

// Creates a new sweet_tommy_track in the DB.
exports.create = function(req, res) {
  SweetTommyTrack.create(req.body, function(err, sweet_tommy_track) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(sweet_tommy_track);
  });
};

// Updates an existing sweet_tommy_track in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  SweetTommyTrack.findById(req.params.id, function (err, sweet_tommy_track) {
    if (err) { return handleError(res, err); }
    if(!sweet_tommy_track) { return res.status(404).send('Not Found'); }
    var updated = _.merge(sweet_tommy_track, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(sweet_tommy_track);
    });
  });
};

// Deletes a sweet_tommy_track from the DB.
exports.destroy = function(req, res) {
  SweetTommyTrack.findById(req.params.id, function (err, sweet_tommy_track) {
    if(err) { return handleError(res, err); }
    if(!sweet_tommy_track) { return res.status(404).send('Not Found'); }
    sweet_tommy_track.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}