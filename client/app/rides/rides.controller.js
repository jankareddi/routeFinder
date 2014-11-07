'use strict';

angular.module('routeFinderApp')
  .controller('RidesCtrl', function ($scope, maprouteService) {
    $scope.routes = maprouteService.getAllRoutes().then(function(routes) {
      $scope.routes = routes.data;
    });

    $scope.hikes = maprouteService.getAllHikes().then(function(hikes) {
      $scope.hikes = hikes.data;
    });

  });
