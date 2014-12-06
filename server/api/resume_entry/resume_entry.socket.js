/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ResumeEntry = require('./resume_entry.model');

exports.register = function(socket) {
  ResumeEntry.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ResumeEntry.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('resume_entry:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('resume_entry:remove', doc);
}