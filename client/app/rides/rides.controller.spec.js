'use strict';

describe('Controller: RidesCtrl', function () {

  // load the controller's module
  beforeEach(module('routeFinderApp'));

  var RidesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RidesCtrl = $controller('RidesCtrl', {
      $scope: scope
    });
  }));

  // it('should ...', function () {
  //   expect(1).toEqual(1);
  // });
});
