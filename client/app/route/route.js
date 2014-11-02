'use strict';

angular.module('routeFinderApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('route', {
        url: '/route',
        templateUrl: 'app/route/route.html',
        controller: 'RouteCtrl'
      });
  });