'use strict';

angular.module('routeFinderApp')
  .controller('RidesCtrl', function ($scope, maprouteService) {
    $scope.routes = maprouteService.getAllRoutes().then(function(routes) {
      $scope.routes = routes.data;
    });

    $scope.hikes = maprouteService.getAllHikes().then(function(hikes) {
      $scope.hikes = hikes.data;
    });

    $scope.paneToShow = 0;

    $scope.onFindMatches = function(hike) {
      var path = maprouteService.getEncodedPath([new google.maps.LatLng(hike.startPoint.lat, hike.startPoint.lng), new google.maps.LatLng(hike.endPoint.lat, hike.endPoint.lng)])
      $scope.matches = maprouteService.getMatches(path).then(function(data) {
        $scope.matches = data.data;
        $scope.paneToShow = 1;
      });
    };

    $scope.onViewRequests = function(hike) {
      $scope.paneToShow = 2;
    };

    $scope.handleSendRequest = function(hike, match) {
      maprouteService.addMatch(hike, match);
    };
  });
