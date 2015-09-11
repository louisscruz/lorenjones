'use strict';

describe('Filter: eventOrder', function () {

  // load the filter's module
  beforeEach(module('lorenjonesApp'));

  // initialize a new instance of the filter before each test
  var eventOrder;
  beforeEach(inject(function ($filter) {
    eventOrder = $filter('eventOrder');
  }));

  it('should return the input prefixed with "eventOrder filter:"', function () {
    var text = 'angularjs';
    expect(eventOrder(text)).toBe('eventOrder filter: ' + text);
  });

});
