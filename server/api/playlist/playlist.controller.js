'use strict';

var _ = require('lodash');
var Playlist = require('./playlist.model');
var Work = require('../work/work.model');

// Get list of playlists
exports.index = function(req, res) {
  Playlist.find(function (err, playlists) {
    if(err) { return handleError(res, err); }
    return res.json(200, playlists);
  });
};

// Get a single playlist
exports.show = function(req, res) {
  Playlist.findOne({}, function(err, playlist) {
    if(err) {
      return handleError(res, err);
    } else if(!playlist) {
      return res.status(404).send('Not Found');
    } else {
      Work.where('audio').exists().ne('audio', '').count({}, function(err, count) {
        var range = _.range(count);
        if (range !== playlist.order.sort()) {
          playlist.order = range;
          playlist.save(function(err) {
            if (err) { handleError(res, err); }
          });
        }
        return res.status(200).json(playlist);
      });
    }
  });
};

// Creates a new playlist in the DB.
exports.create = function(req, res) {
  Playlist.create(req.body, function(err, playlist) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(playlist);
  });
};

// Updates an existing playlist in the DB.
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }
  Playlist.findOne({}, function(err, playlist) {
    if (err) {
      return handleError(res, err);
    } else if (!playlist) {
      return res.status(404).send('Not Found');
    } else if(_.isEqual(req.body.order, playlist.order)) {
      return res.status(304).json(playlist);
    } else {
      Work.where('audio').exists().ne('audio', '').count({}, function(err, count) {
        if (count !== req.body.order.length) {
          console.log('inside');
          var range = _.range(count);
          playlist.order = range;
          playlist.save(function(err) {
            if (err) { handleError(res, err); }
          });
        } else {
          playlist.order = req.body.order;
        }
        playlist.save(function(err) {
          if (err) { return handleError(res, err); }
          return res.status(200).json(playlist)
        });
      });
    }
  });
};

// Deletes a playlist from the DB.
exports.destroy = function(req, res) {
  Playlist.findById(req.params.id, function (err, playlist) {
    if(err) { return handleError(res, err); }
    if(!playlist) { return res.status(404).send('Not Found'); }
    playlist.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
