'use strict';

describe('Service: eventsFact', function () {

  // load the service's module
  beforeEach(module('lorenjonesApp'));

  // instantiate service
  var eventsFact;
  beforeEach(inject(function (_eventsFact_) {
    eventsFact = _eventsFact_;
  }));

  it('should do something', function () {
    expect(!!eventsFact).toBe(true);
  });

});
