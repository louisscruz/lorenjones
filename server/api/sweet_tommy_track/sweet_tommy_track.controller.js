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

function handleError(res, err) {
  return res.status(500).send(err);
}
