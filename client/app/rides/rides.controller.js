'use strict';
/* global google*/

angular.module('routeFinderApp')
  .controller('RidesCtrl', function ($scope, maprouteService) {
    $scope.routes = maprouteService.getAllRoutes().then(function(routes) {
      $scope.routes = routes.data;
    });

    $scope.routes.requests = $scope.routes.accepts = $scope.routes.rejects = {};

    $scope.getHikesForRoute = function(route) {
      maprouteService.getHikesForRoute(route).then(function(hikes) {
        route.requests = hikes.data.requests;
        route.accepts = hikes.data.accepts;
        route.rejects = hikes.data.rejects;
      });
    };

    $scope.hikes = maprouteService.getAllHikes().then(function(hikes) {
      $scope.hikes = hikes.data;
    });

    $scope.paneToShow = 0;

    $scope.onFindMatches = function(hike) {
      var path = maprouteService.getEncodedPath([new google.maps.LatLng(hike.startPoint.lat, hike.startPoint.lng), new google.maps.LatLng(hike.endPoint.lat, hike.endPoint.lng)]);
      $scope.matches = maprouteService.getMatches(path).then(function(data) {
        $scope.matches = data.data;
        $scope.paneToShow = 1;
      });
    };

    /*jshint unused:false */
    $scope.onViewRequests = function(hike) {
      $scope.paneToShow = 2;
    };

    $scope.handleSendRequest = function(hike, match) {
      maprouteService.addMatch(hike, match).then(resetHike);
    };

    $scope.removeFrom = function(hike, collectionType, id) {
      maprouteService.removeHikeFromCollection(hike, collectionType, id).then(resetHike);
    };

    $scope.addRouteToHike = function(route, collectionType, hike) {
      maprouteService.setRouteOnHike(route, collectionType, hike).then(resetHike);
    };

    var resetHike = function(data) {
      // replace the hike with the one returned
      $scope.hikes = _.map($scope.hikes, function(item) {
        if (item._id.toString() === data.data._id.toString()) {
          return data.data;
        }
        else {
          return item;
        }
      });
    };
  });
