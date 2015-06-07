'use strict';

describe('Controller: DbwCtrl', function () {

  // load the controller's module
  beforeEach(module('lorenjonesApp'));

  var DbwCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DbwCtrl = $controller('DbwCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
