'use strict';

var _ = require('lodash');
var Hike = require('./hike.model');

// Get list of hikes
exports.index = function(req, res) {
  Hike.find()
  .populate('maprouteRequests')
  .exec(function(err, hikes) {
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

// add a route to hike
exports.addMatch = function(req, res) {
  Hike.findById(req.params.id, function (err, hike) {
    if (err) { return handleError(res, err); }
    if(!hike) { return res.send(404); }
    if (containsObjectId(hike, req.body.obj._id.toString())) {
      return res.json(409);
    }
    hike.maprouteRequests.push(req.body.obj._id.toString());
    hike.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, hike);
    });
  });
};

function containsObjectId(hike, id) {
  var retValue = false;
  var mr = _.map(hike.maprouteRequests, function(item) {
    return item.toString();
  });

  var ma = _.map(hike.maprouteAccepts, function(item) {
    return item.toString();
  });

  var mrj = _.map(hike.maprouteRejects, function(item) {
    return item.toString();
  });

  if (_.contains(mr, id) || _.contains(ma, id) || _.contains(mrj, id)) {
      return true;
    }

  return retValue;
}

function handleError(res, err) {
  return res.send(500, err);
}