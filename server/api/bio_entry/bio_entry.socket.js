/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var BioEntry = require('./bio_entry.model');

exports.register = function(socket) {
  BioEntry.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  BioEntry.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('bio_entry:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('bio_entry:remove', doc);
}