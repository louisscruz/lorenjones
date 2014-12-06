/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ResumeCategory = require('./resume_category.model');

exports.register = function(socket) {
  ResumeCategory.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ResumeCategory.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('resume_category:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('resume_category:remove', doc);
}