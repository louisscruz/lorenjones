'use strict';

describe('Filter: eventDateFilter', function () {

  // load the filter's module
  beforeEach(module('lorenjonesApp'));

  // initialize a new instance of the filter before each test
  var eventDateFilter;
  beforeEach(inject(function ($filter) {
    eventDateFilter = $filter('eventDateFilter');
  }));

  it('should return the input prefixed with "eventDateFilter filter:"', function () {
    var text = 'angularjs';
    expect(eventDateFilter(text)).toBe('eventDateFilter filter: ' + text);
  });

});
