'use strict';

describe('Service: instaFact', function () {

  // load the service's module
  beforeEach(module('louiscruzApp'));

  // instantiate service
  var instaFact;
  beforeEach(inject(function (_instaFact_) {
    instaFact = _instaFact_;
  }));

  it('should do something', function () {
    expect(!!instaFact).toBe(true);
  });

});
