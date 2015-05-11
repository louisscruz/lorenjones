'use strict';

describe('Controller: AdminHomepageCtrl', function () {

  // load the controller's module
  beforeEach(module('louiscruzApp'));

  var AdminHomepageCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminHomepageCtrl = $controller('AdminHomepageCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
