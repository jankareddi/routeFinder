'use strict';

var _ = require('lodash');
var Maproute = require('./maproute.model');
var polyline = require('polyline');

// Get list of maproutes
exports.index = function(req, res) {
  Maproute.find(function (err, maproutes) {
    if(err) { return handleError(res, err); }
    return res.json(200, maproutes);
  });
};

// Get a single maproute
exports.show = function(req, res) {
  Maproute.findById(req.params.id, function (err, maproute) {
    if(err) { return handleError(res, err); }
    if(!maproute) { return res.send(404); }
    return res.json(maproute);
  });
};

// Creates a new maproute in the DB.
exports.create = function(req, res) {
  Maproute.create(req.body, function(err, maproute) {
    if(err) { return handleError(res, err); }
    return res.json(201, maproute);
  });
};

// Updates an existing maproute in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Maproute.findById(req.params.id, function (err, maproute) {
    if (err) { return handleError(res, err); }
    if(!maproute) { return res.send(404); }
    var updated = _.merge(maproute, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, maproute);
    });
  });
};

// Deletes a maproute from the DB.
exports.destroy = function(req, res) {
  Maproute.findById(req.params.id, function (err, maproute) {
    if(err) { return handleError(res, err); }
    if(!maproute) { return res.send(404); }
    maproute.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.matchRoutes = function(req, res) {
    var startpoint = { type : "Point", coordinates : [  73.9092, 18.4581] };
    var endpoint = { type : "Point", coordinates : [73.9143, 18.5679] };
    var tolerance = parseInt(req.query.tolerance);
    var pointPath = polyline.decode(req.query.path);

    // use the factor due to a bug in mongoose. likely to addressed in mongoose 3.8.18+
    var maxDist = tolerance/6378137;
    startpoint.coordinates = [pointPath[0][1], pointPath[0][0]];
    endpoint.coordinates = [pointPath[1][1], pointPath[1][0]];

    var consolidatedRoutes = {},
        routeSet1, routeSet2;

    Maproute.geoNear(startpoint, {maxDistance : maxDist, spherical : true}, function(err, routes) {
      if (_.isUndefined(routes) || _.isEmpty(routes))
        return res.send(200, []);

      routeSet1 = routes;

      Maproute.geoNear(endpoint, {maxDistance : maxDist, spherical : true}, function(err, routes) {
        if (_.isUndefined(routes) || _.isEmpty(routes))
        return res.send(200, []);

        routeSet2 = routes;

        consolidatedRoutes = routeSet1.concat(routeSet2);

        // run an aggregate on the consolidate list to find a route that appears in both route sets
        var countOfRoutes = _.pairs(_.countBy(consolidatedRoutes, function(item) {
          return item.obj._id;
        }));

        // filter for routes that appear twice (meaning they are close to both points) and then get list of route IDs for those
        var filteredRouteIds = _.map(_.filter(countOfRoutes, function(item) {
          return (item[1] === 2);
        }), function(item) { return item[0]; });

        // list of routes filtered by route IDs obtained in previous step
        var filteredRoutes = _.filter(routeSet1, function(item) {
          return _.contains(filteredRouteIds, item.obj._id.toString());
        });

        return res.send(200, filteredRoutes);

      });
    });

  };

function handleError(res, err) {
  return res.send(500, err);
}