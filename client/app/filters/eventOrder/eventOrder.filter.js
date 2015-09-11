'use strict';

angular.module('lorenjonesApp')
  .filter('eventOrder', function () {
    return function (input) {
      return 'eventOrder filter: ' + input;
    };
  });
