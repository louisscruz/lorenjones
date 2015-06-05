/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var DefaultTrack = require('./default_track.model');

exports.register = function(socket) {
  DefaultTrack.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  DefaultTrack.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('default_track:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('default_track:remove', doc);
}