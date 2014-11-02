'use strict';

angular.module('routeFinderApp')
  .factory('maprouteService', function ($http, $q) {

    var geoCoder = new google.maps.Geocoder();

    // Public API here
    return {
      getMatches: function (encodedPath) {
        var promise = $http.get('/api/maproutes/matches?tolerance=2000&path=' + encodedPath);
        return promise;
      },

      addMaproute : function(maprouteData) {
        var promise = $http.post('/api/maproutes', maprouteData);
        return promise;
      },

      getLatLngFromString : function(location) {

        var deferred = $q.defer();

        geoCoder.geocode({'address' : location}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            deferred.resolve(results[0].geometry.location);
          } else {
            deferred.reject("Geocode was not successful for the following reason: " + status);
          }
        });

        return deferred.promise;
      },

      getEncodedPath : function(points) {
        return google.maps.geometry.encoding.encodePath(points);
      }
    };
  });
