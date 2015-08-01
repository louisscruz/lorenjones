'use strict';

describe('Service: soundcloudConfig', function () {

  // load the service's module
  beforeEach(module('lorenjonesApp'));

  // instantiate service
  var soundcloudConfig;
  beforeEach(inject(function (_soundcloudConfig_) {
    soundcloudConfig = _soundcloudConfig_;
  }));

  it('should do something', function () {
    expect(!!soundcloudConfig).toBe(true);
  });

});