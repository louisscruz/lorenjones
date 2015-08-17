'use strict';

describe('Service: cleanUrl', function () {

  // load the service's module
  beforeEach(module('lorenjonesApp'));

  // instantiate service
  var cleanUrl;
  beforeEach(inject(function (_cleanUrl_) {
    cleanUrl = _cleanUrl_;
  }));

  it('should do something', function () {
    expect(!!cleanUrl).toBe(true);
  });

});
