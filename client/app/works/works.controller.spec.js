'use strict';

describe('Controller: WorksCtrl', function () {

  // load the controller's module
  beforeEach(module('lorenjonesApp'));

  var WorksCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WorksCtrl = $controller('WorksCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
