'use strict';

angular.module('routeFinderApp')
  .factory('maprouteService', function ($http, $q) {

    var geoCoder = new google.maps.Geocoder();
    
    var makeHikeNode = function(hikePt) {
      var hikeNode = {lng : hikePt.loc.lng(), lat : hikePt.loc.lat(), address : hikePt.address};      
      return hikeNode;
    };

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
            var returnValue = {loc : results[0].geometry.location, address : results[0].formatted_address};
            deferred.resolve(returnValue);
          } else {
            deferred.reject("Geocode was not successful for the following reason: " + status);
          }
        });

        return deferred.promise;
      },

      getEncodedPath : function(points) {
        return google.maps.geometry.encoding.encodePath(points);
      },

      addHike : function(startPt, endPt) {
        var hikePoints = {};
        hikePoints.startPoint = makeHikeNode(startPt);
        hikePoints.endPoint = makeHikeNode(endPt);

        var promise = $http.post('/api/hikes', hikePoints);
        return promise;
      },

      getAllRoutes : function() {
        var promise = $http.get('/api/maproutes');
        return promise;
      },

      getAllHikes : function() {
        var promise = $http.get('/api/hikes');
        return promise;
      }
    };
  });
