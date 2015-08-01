'use strict';

angular.module('lorenjonesApp')
  .provider('soundcloudConfig', function () {
    this.clientId = 'a7654b6d1d451c513253de1b4dc8a65d';
    var _this = this;
    this.$get = function() {
      return {
        clientId: _this.clientId
      };
    };
  });
