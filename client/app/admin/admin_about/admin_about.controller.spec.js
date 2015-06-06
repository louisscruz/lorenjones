'use strict';

describe('Controller: AdminAboutCtrl', function () {

  // load the controller's module
  beforeEach(module('lorenjonesApp'));

  var AdminAboutCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminAboutCtrl = $controller('AdminAboutCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
