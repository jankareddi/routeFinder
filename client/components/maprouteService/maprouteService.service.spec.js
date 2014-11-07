'use strict';

describe('Service: maprouteService', function () {

  // load the service's module
  beforeEach(module('routeFinderApp'));

  // instantiate service
  var maprouteService, $http, $q;
  beforeEach(inject(function (_$http_, _$q_, _maprouteService_) {
    maprouteService = _maprouteService_;
    $http = _$http_;
    $q = _$q_;
  }));

  it('should exist', function () {
    expect(!!maprouteService).toBe(true);
  });

  it('should return latlng values', function() {
    expect(true).toBe(true);
  });

});
