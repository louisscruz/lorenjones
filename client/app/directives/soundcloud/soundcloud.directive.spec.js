'use strict';

describe('Directive: soundcloud', function () {

  // load the directive's module
  beforeEach(module('lorenjonesApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<soundcloud></soundcloud>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the soundcloud directive');
  }));
});