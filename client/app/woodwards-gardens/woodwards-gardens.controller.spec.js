'use strict';

describe('Controller: WoodwardsGardenCtrl', function () {

  // load the controller's module
  beforeEach(module('lorenjonesApp'));

  var WoodwardsGardenCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WoodwardsGardenCtrl = $controller('WoodwardsGardenCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
