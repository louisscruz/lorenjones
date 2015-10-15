/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var SweetTommyTrack = require('./sweet_tommy_track.model');

exports.register = function(socket) {
  SweetTommyTrack.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  SweetTommyTrack.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('sweet_tommy_track:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sweet_tommy_track:remove', doc);
}