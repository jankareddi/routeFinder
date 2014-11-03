/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Hike = require('./hike.model');

exports.register = function(socket) {
  Hike.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Hike.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('hike:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('hike:remove', doc);
}