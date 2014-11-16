'use strict';
/* global google*/

angular.module('routeFinderApp')
  .controller('RouteCtrl', function ($scope, $window, maprouteService) {
    $scope.message = 'Hello';
    $scope.myMarkers = [];
    $scope.currentLocation = {lat : 78.460913, lng : 73.900740};
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    if ($window.navigator.geolocation) {

      $window.navigator.geolocation.getCurrentPosition(function setPosition(pos) {

        $scope.currentLocation = {lat : pos.coords.latitude, lng : pos.coords.longitude};
        $scope.pushMarker($scope.currentLocation);
        $scope.myMap.panTo($scope.currentLocation);

      }, function handleError(err) {

        $window.alert('Unable to get current location' + err);

      }, {timeout : 5000, enableHighAccuracy : true});
    } else {

      $window.alert('geolocation is null');
    }

    $scope.mapOptions = {
      center: new google.maps.LatLng($scope.currentLocation.lat, $scope.currentLocation.lng), //(18.460913, 73.900740),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.addMarker = function($event, $params) {
      $scope.pushMarker($params[0].latLng);

      $scope.myMap.panTo($params[0].latLng);  
    };
 
    $scope.setZoomMessage = function(zoom) {
      $scope.zoomMessage = 'You just zoomed to '+zoom+'!';
      console.log(zoom,'zoomed');
    };

    $scope.offerRideClicked = function() {
      directionsDisplay.setMap($scope.myMap);

      var request = {
        origin:$scope.startLoc,
        destination:$scope.endLoc,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);

          // add the route to the store
          var maprouteData = {};
          maprouteData.startPoint = {lng : result.routes[0].legs[0].start_location.lng(), lat : result.routes[0].legs[0].start_location.lat(), address : result.routes[0].legs[0].start_address};
          maprouteData.endPoint = {lng : result.routes[0].legs[0].end_location.lng(), lat : result.routes[0].legs[0].end_location.lat(), address : result.routes[0].legs[0].end_address};
          maprouteData.overview_polyline = result.routes[0].overview_polyline;
          maprouteData.loc = {};
          maprouteData.loc.type = 'MultiPoint';
          maprouteData.loc.coordinates = _.map(result.routes[0].overview_path, function(item) {
            return [item.lng(), item.lat()];
          });

          maprouteService.addMaproute(maprouteData);
        }
      });
    };

    $scope.requestRideClicked = function() {
      maprouteService.getLatLngFromString($scope.startLoc).then(function(data) {
        var startPt = data;

        maprouteService.getLatLngFromString($scope.endLoc).then(function(data) {
          var endPt = data;

          // store the ride request
          maprouteService.addHike(startPt, endPt).catch(function(err) {
            $window.alert(err);
          });

          // var encodedPath = maprouteService.getEncodedPath([startPt.loc,endPt.loc]);
          // // find out if there is a matching route here
          // maprouteService.getMatches(encodedPath).then(function(data) {
          //   // if sucessful, a list of matching routes will be returned
          //   var i = data;
          // });
        });
      }, function(err) {
        $window.alert(err);
      });
    };

    $scope.pushMarker = function(pushPosition) {
      $scope.myMarkers.push(new google.maps.Marker({
        map: $scope.myMap,
        position: pushPosition
      }));
    };
  });
