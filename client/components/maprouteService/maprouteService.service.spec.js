'use strict';

describe('Service: maprouteService', function () {

  // load the service's module
  beforeEach(module('routeFinderApp'));

  // instantiate service
  var maprouteService;
  beforeEach(inject(function (_maprouteService_) {
    maprouteService = _maprouteService_;
  }));

  it('should do something', function () {
    expect(!!maprouteService).toBe(true);
  });

});
