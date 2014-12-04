'use strict';

describe('Controller: AdminWorksCtrl', function () {

  // load the controller's module
  beforeEach(module('louiscruzApp'));

  var AdminWorksCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminWorksCtrl = $controller('AdminWorksCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
