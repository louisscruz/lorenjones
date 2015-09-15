'use strict';

angular.module('lorenjonesApp')
  .filter('eventDateFilter', function () {
    return function (input) {
      return 'eventDateFilter filter: ' + input;
    };
  });
