'use strict';

describe('Filter: naturalSort', function () {

  // load the filter's module
  beforeEach(module('lorenjonesApp'));

  // initialize a new instance of the filter before each test
  var naturalSort;
  beforeEach(inject(function ($filter) {
    naturalSort = $filter('naturalSort');
  }));

  it('should return the input prefixed with "naturalSort filter:"', function () {
    var text = 'angularjs';
    expect(naturalSort(text)).toBe('naturalSort filter: ' + text);
  });

});
