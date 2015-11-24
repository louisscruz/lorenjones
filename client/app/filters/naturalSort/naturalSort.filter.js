'use strict';

angular.module('lorenjonesApp')
  .filter('naturalSort', function () {
    return function (input) {
      return 'naturalSort filter: ' + input;
    };
  });
