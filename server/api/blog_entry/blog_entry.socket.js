/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var BlogEntry = require('./blog_entry.model');

exports.register = function(socket) {
  BlogEntry.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  BlogEntry.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('blog_entry:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('blog_entry:remove', doc);
}