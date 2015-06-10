'use strict';

describe('Service: stellarFact', function () {

  // load the service's module
  beforeEach(module('lorenjonesApp'));

  // instantiate service
  var stellarFact;
  beforeEach(inject(function (_stellarFact_) {
    stellarFact = _stellarFact_;
  }));

  it('should do something', function () {
    expect(!!stellarFact).toBe(true);
  });

});
