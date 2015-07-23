'use strict';

describe('Service: alertFact', function () {

  // load the service's module
  beforeEach(module('lorenjonesApp'));

  // instantiate service
  var alertFact;
  beforeEach(inject(function (_alertFact_) {
    alertFact = _alertFact_;
  }));

  it('should do something', function () {
    expect(!!alertFact).toBe(true);
  });

});
