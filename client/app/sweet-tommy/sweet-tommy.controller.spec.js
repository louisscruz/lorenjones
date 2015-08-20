'use strict';

describe('Controller: SweetTommyCtrl', function () {

  // load the controller's module
  beforeEach(module('lorenjonesApp'));

  var SweetTommyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SweetTommyCtrl = $controller('SweetTommyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
