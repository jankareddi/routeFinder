'use strict';

describe('Service: lodashService', function () {

  // load the service's module
  beforeEach(module('routeFinderApp'));

  // instantiate service
  var _;
  beforeEach(inject(function (___) {
    _ = ___;
  }));

  it('should do something', function () {
    expect(!!_).toBe(true);
  });

});
