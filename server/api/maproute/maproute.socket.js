/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Maproute = require('./maproute.model');

exports.register = function(socket) {
  Maproute.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Maproute.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('maproute:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('maproute:remove', doc);
}