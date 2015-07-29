'use strict';

describe('Controller: AdminPlaylistCtrl', function () {

  // load the controller's module
  beforeEach(module('lorenjonesApp'));

  var AdminPlaylistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminPlaylistCtrl = $controller('AdminPlaylistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
