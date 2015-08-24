'use strict';

angular.module('lorenjonesApp')
  .factory('cleanUrl', function () {
    return function(url) {
      var u = url;
      if (u.indexOf('https' !== -1)) {
        u = u.replace('https', 'http');
      }
      return u;
    };
  });
