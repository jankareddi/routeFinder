'use strict';

angular.module('routeFinderApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('rides', {
        url: '/rides',
        templateUrl: 'app/rides/rides.html',
        controller: 'RidesCtrl',
        authenticate: true
      });
  });