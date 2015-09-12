'use strict';

describe('Directive: validAddress', function () {

  // load the directive's module
  beforeEach(module('lorenjonesApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<valid-address></valid-address>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the validAddress directive');
  }));
});