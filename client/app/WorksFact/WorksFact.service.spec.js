'use strict';

describe('Service: WorksFact', function () {

  // load the service's module
  beforeEach(module('louiscruzApp'));

  // instantiate service
  var WorksFact;
  beforeEach(inject(function (_WorksFact_) {
    WorksFact = _WorksFact_;
  }));

  it('should do something', function () {
    expect(!!WorksFact).toBe(true);
  });

});
