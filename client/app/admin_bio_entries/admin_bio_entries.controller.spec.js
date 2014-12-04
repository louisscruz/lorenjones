'use strict';

describe('Controller: AdminBioEntriesCtrl', function () {

  // load the controller's module
  beforeEach(module('louiscruzApp'));

  var AdminBioEntriesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminBioEntriesCtrl = $controller('AdminBioEntriesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
