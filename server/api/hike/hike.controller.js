'use strict';

var _ = require('lodash');
var Hike = require('./hike.model');

// Get list of hikes
exports.index = function(req, res) {
  Hike.find()
  .populate('maprouteRequests maprouteAccepts maprouteRejects')
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
  Hike.findById(req.params.id)
  .populate('maprouteRequests maprouteAccepts maprouteRejects')
  .exec(function (err, hike) {
    if (err) { return handleError(res, err); }
    if(!hike) { return res.send(404); }
    if (containsObjectId(hike._doc, req.body.obj._id.toString())) {
      return res.json(409);
    }
    hike._doc.maprouteRequests.push(req.body.obj);
    hike.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, hike);
    });
  });
};

exports.removeRouteFromHike = function(req, res) {
  Hike.findById(req.params.id, function (err, hike) {
    if (err) { return handleError(res, err); }
    if(!hike) { return res.send(404); }

    // find if the route exists in the collection specified
    // delete it and return the object - hence returning http 200 instead of 204
    if (req.params.collectionType === 'requests') {
      hike._doc.maprouteRequests = _.filter(hike._doc.maprouteRequests, function(item) {
        return (item.toString() !== req.params.routeId);
      });

      // make sure object is marked modified so mongoose can save the object to DB
      hike.markModified('maprouteRequests');
    } else if (req.params.collectionType === 'accepts') {
      hike._doc.maprouteAccepts = _.filter(hike._doc.maprouteAccepts, function(item) {
        return (item.toString() !== req.params.routeId);
      });

      // make sure object is marked modified so mongoose can save the object to DB
      hike.markModified('maprouteAccepts');
    } else if (req.params.collectionType === 'rejects') {
      hike._doc.maprouteRejects = _.filter(hike._doc.maprouteRejects, function(item) {
        return (item.toString() !== req.params.routeId);
      });

      // make sure object is marked modified so mongoose can save the object to DB
      hike.markModified('maprouteRejects');
    }

    hike.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, hike);
    });
  });
};

exports.setRouteOnHike = function(req, res) {
  var routeId = req.body._id.toString();
  var collectionType  = req.params.collectionType;

  Hike.findById(req.params.id)
  .populate('maprouteRequests maprouteAccepts maprouteRejects')
  .exec(function (err, hike) {

    // if the collection type is "accepts", then the hike has to exist in either requests or rejects and not in accepts
    if (collectionType === "accepts") {
      if (!containsObjectIdInList(hike._doc.maprouteAccepts, routeId)) {
        if (containsObjectIdInList(hike._doc.maprouteRequests, routeId)) {
          // remove from requests and add to accepts
          hike._doc.maprouteRequests = _.filter(hike._doc.maprouteRequests, function(item) {
            return (item._doc._id.toString() !== routeId);
          });
          hike.markModified('maprouteRequests');
          hike._doc.maprouteAccepts.push(req.body);
          hike.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, hike);
          });
        } else if (containsObjectIdInList(hike._doc.maprouteRejects, routeId)) {
          // remove from rejects and add to accepts
          hike._doc.maprouteRejects = _.filter(hike._doc.maprouteRejects, function(item) {
            return (item._doc._id.toString() !== routeId);
          });
          hike.markModified('maprouteRejects');
          hike._doc.maprouteAccepts.push(req.body);
          hike.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, hike);
          });
        }
      }
    }
    // if the collection type is "rejects", then the hike has to exist in either requests or accepts and not in rejects
    if (collectionType === "rejects") {
      if (!containsObjectIdInList(hike._doc.maprouteRejects, routeId)) {
        if (containsObjectIdInList(hike._doc.maprouteRequests, routeId)) {
          // remove from requests and add to rejects
          hike._doc.maprouteRequests = _.filter(hike._doc.maprouteRequests, function(item) {
            return (item._doc._id.toString() !== routeId);
          });
          hike.markModified('maprouteRequests');
          hike._doc.maprouteRejects.push(req.body);
          hike.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, hike);
          });
        } else if (containsObjectIdInList(hike._doc.maprouteAccepts, routeId)) {
          // remove from accepts and add to rejects
          hike._doc.maprouteAccepts = _.filter(hike._doc.maprouteAccepts, function(item) {
            return (item._doc._id.toString() !== routeId);
          });
          hike.markModified('maprouteAccepts');
          hike._doc.maprouteRejects.push(req.body);
          hike.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, hike);
          });
        }
      }
    }
    // if the collection type is "requests", then the hike can't exist in requests, accepts or rejects
  });
};

function containsObjectId(hike, id) {
  return (containsObjectIdInList(hike.maprouteRequests, id) || containsObjectIdInList(hike.maprouteAccepts, id) || containsObjectIdInList(hike.maprouteRejects, id));
}

function containsObjectIdInList(list, id) {
  var stringifiedObjectIds = _.map(list, function(item) {
    return item._id.toString();
  });

  return _.contains(stringifiedObjectIds, id);
}

function handleError(res, err) {
  return res.send(500, err);
}