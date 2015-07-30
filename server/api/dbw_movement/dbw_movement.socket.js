/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var DbwMovement = require('./dbw_movement.model');

exports.register = function(socket) {
  DbwMovement.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  DbwMovement.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('dbw_movement:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('dbw_movement:remove', doc);
}