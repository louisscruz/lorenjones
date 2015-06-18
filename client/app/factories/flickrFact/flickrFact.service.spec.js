'use strict';

describe('Service: flickrFact', function () {

  // load the service's module
  beforeEach(module('lorenjonesApp'));

  // instantiate service
  var flickrFact;
  beforeEach(inject(function (_flickrFact_) {
    flickrFact = _flickrFact_;
  }));

  it('should do something', function () {
    expect(!!flickrFact).toBe(true);
  });

});
