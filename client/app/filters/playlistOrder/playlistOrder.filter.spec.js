'use strict';

describe('Filter: playlistOrder', function () {

  // load the filter's module
  beforeEach(module('lorenjonesApp'));

  // initialize a new instance of the filter before each test
  var playlistOrder;
  beforeEach(inject(function ($filter) {
    playlistOrder = $filter('playlistOrder');
  }));

  it('should return the input prefixed with "playlistOrder filter:"', function () {
    var text = 'angularjs';
    expect(playlistOrder(text)).toBe('playlistOrder filter: ' + text);
  });

});
