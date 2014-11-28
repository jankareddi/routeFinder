'use strict';
/* global google*/

angular.module('routeFinderApp')
  .controller('RouteCtrl', function ($scope, $window, maprouteService, Auth) {
    $scope.message = 'Hello';
    $scope.myMarkers = [];
    $scope.currentLocation = {lat : 78.460913, lng : 73.900740};
    $scope.minDate = new Date();
    $scope.startDate = new Date();
    $scope.startTime = new Date();
    $scope.format = 'dd-MMMM-yyyy';

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };


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
          maprouteData.startTime = getStartDate();

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
          var hikePoints = {};
          hikePoints.startPoint = makeHikeNode(startPt);
          hikePoints.endPoint = makeHikeNode(endPt);
          hikePoints.startTime = getStartDate();
          maprouteService.addHike(hikePoints).catch(function(err) {
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

    var makeHikeNode = function(hikePt) {
      var hikeNode = {lng : hikePt.loc.lng(), lat : hikePt.loc.lat(), address : hikePt.address};      
      return hikeNode;
    };

    var getStartDate = function() {
      var dt = new Date($scope.startDate.getFullYear(), $scope.startDate.getMonth(), $scope.startDate.getDate(), $scope.startTime.getHours(), $scope.startTime.getMinutes(), 0);
      return dt;
    };
  });
