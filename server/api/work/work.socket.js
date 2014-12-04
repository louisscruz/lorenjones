/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Work = require('./work.model');

exports.register = function(socket) {
  Work.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Work.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('work:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('work:remove', doc);
}