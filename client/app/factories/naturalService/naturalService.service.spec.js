'use strict';

describe('Service: naturalService', function () {

  // load the service's module
  beforeEach(module('lorenjonesApp'));

  // instantiate service
  var naturalService;
  beforeEach(inject(function (_naturalService_) {
    naturalService = _naturalService_;
  }));

  it('should do something', function () {
    expect(!!naturalService).toBe(true);
  });

});
