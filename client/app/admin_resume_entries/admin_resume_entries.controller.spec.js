'use strict';

describe('Controller: AdminResumeEntriesCtrl', function () {

  // load the controller's module
  beforeEach(module('louiscruzApp'));

  var AdminResumeEntriesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminResumeEntriesCtrl = $controller('AdminResumeEntriesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
