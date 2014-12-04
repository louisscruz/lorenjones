'use strict';

describe('Controller: AdminEventsCtrl', function () {

  // load the controller's module
  beforeEach(module('louiscruzApp'));

  var AdminEventsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminEventsCtrl = $controller('AdminEventsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
