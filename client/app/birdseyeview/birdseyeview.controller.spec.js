'use strict';

describe('Controller: BirdseyeviewCtrl', function () {

  // load the controller's module
  beforeEach(module('lorenjonesApp'));

  var BirdseyeviewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BirdseyeviewCtrl = $controller('BirdseyeviewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
