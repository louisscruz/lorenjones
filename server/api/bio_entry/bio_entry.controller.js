'use strict';

var _ = require('lodash');
var BioEntry = require('./bio_entry.model');

// Get list of bio_entrys
exports.index = function(req, res) {
  BioEntry.find(function (err, bio_entries) {
    if(err) { return handleError(res, err); }
    return res.json(200, bio_entries);
  });
};

// Get a single bio_entry
exports.show = function(req, res) {
  BioEntry.findById(req.params.id, function (err, bio_entry) {
    if(err) { return handleError(res, err); }
    if(!bio_entry) { return res.send(404); }
    return res.json(bio_entry);
  });
};

// Creates a new bio_entry in the DB.
exports.create = function(req, res) {
  BioEntry.create(req.body, function(err, bio_entry) {
    if(err) { return handleError(res, err); }
    return res.json(201, bio_entry);
  });
};

// Reorders the bio_entries
exports.reorder = function(req, res) {
  BioEntry.find(function(err, bio_entries) {
    console.log(bio_entries);
    if (err) { return handleError(res, err); }
    var reorderedEntries = req.body.reorderedEntries;
    for (var i = 0; i < bio_entries.length; i++) {
      if (bio_entries[i]._id != reorderedEntries[i]._id) {
        var update = _.merge(bio_entries[i], reorderedEntries[i]);
        console.log(update);
        update.save(function(err) {
          if (err) { return handleError(res, err); }
        });
      }
    }
    return res.json(200, bio_entries);
  });
};

// Updates an existing bio_entry in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  BioEntry.findById(req.params.id, function (err, bio_entry) {
    if (err) { return handleError(res, err); }
    if(!bio_entry) { return res.send(404); }
    var updated = _.merge(bio_entry, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, bio_entry);
    });
  });
};

// Deletes a bio_entry from the DB.
exports.destroy = function(req, res) {
  BioEntry.findById(req.params.id, function (err, bio_entry) {
    if(err) { return handleError(res, err); }
    if(!bio_entry) { return res.send(404); }
    bio_entry.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
