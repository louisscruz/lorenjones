'use strict';

describe('Service: worksFact', function () {

  // load the service's module
  beforeEach(module('lorenjonesApp'));

  // instantiate service
  var worksFact;
  beforeEach(inject(function (_worksFact_) {
    worksFact = _worksFact_;
  }));

  it('should do something', function () {
    expect(!!worksFact).toBe(true);
  });

});
