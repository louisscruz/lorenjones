'use strict';

describe('Controller: WoodwardsGardensCtrl', function () {

  // load the controller's module
  beforeEach(module('lorenjonesApp'));

  var WoodwardsGardensCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WoodwardsGardensCtrl = $controller('WoodwardsGardensCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
