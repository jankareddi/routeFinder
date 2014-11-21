'use strict';

describe('Controller: RouteCtrl', function () {

  // load the controller's module
  beforeEach(module('routeFinderApp'));

  var RouteCtrl, scope, mockWindow, q, mockmaprouteService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    q = $q;
    mockWindow = {
      alert : function(msg) {},
      navigator : {
        geoLocation : {
          getCurrentPosition : function(cb, cbError, options) {

          }
        }
      }
    };

    mockmaprouteService = {
      getLatLngFromString : function(position) {
        var deferred = q.defer();
        deferred.resolve({lat: 10, lng: 10});
        return deferred.promise();
      },

      addHike : function(startPt, endPt) {

      },

      addMaproute : function(data) {

      }
    };

    RouteCtrl = $controller('RouteCtrl', {
      $scope: scope,
      $window: mockWindow,
      maprouteServive: mockmaprouteService
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });

  it('should check for number of markers', function() {
    scope.pushMarker({lat:10, lng:10});
    expect(scope.myMarkers.length).toBe(1);
  });

  it ('should check for route being offered', function(done) {
    scope.startLoc = "Pune";
    scope.endLoc = "Mumbai";
    spyOn(mockmaprouteService, 'addMaproute');
    scope.offerRideClicked();
    setTimeout(function() {
      //done();
      expect(mockmaprouteService.addMaproute).toHaveBeenCalled();
      done();
    }, 5000);
  });

});
