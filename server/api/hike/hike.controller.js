'use strict';

var _ = require('lodash');
var Hike = require('./hike.model');

// Get list of hikes
exports.index = function(req, res) {
  Hike.find(function (err, hikes) {
    if(err) { return handleError(res, err); }
    return res.json(200, hikes);
  });
};

// Get a single hike
exports.show = function(req, res) {
  Hike.findById(req.params.id, function (err, hike) {
    if(err) { return handleError(res, err); }
    if(!hike) { return res.send(404); }
    return res.json(hike);
  });
};

// Creates a new hike in the DB.
exports.create = function(req, res) {
  Hike.create(req.body, function(err, hike) {
    if(err) { return handleError(res, err); }
    return res.json(201, hike);
  });
};

// Updates an existing hike in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Hike.findById(req.params.id, function (err, hike) {
    if (err) { return handleError(res, err); }
    if(!hike) { return res.send(404); }
    var updated = _.merge(hike, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, hike);
    });
  });
};

// Deletes a hike from the DB.
exports.destroy = function(req, res) {
  Hike.findById(req.params.id, function (err, hike) {
    if(err) { return handleError(res, err); }
    if(!hike) { return res.send(404); }
    hike.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}