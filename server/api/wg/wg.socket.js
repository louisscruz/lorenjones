/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Wg = require('./wg.model');

exports.register = function(socket) {
  Wg.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Wg.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('wg:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('wg:remove', doc);
}