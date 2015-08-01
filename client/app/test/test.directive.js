'use strict';

angular.module('lorenjonesApp')
  .directive('test', function () {
    return {
      template: '<div></div>',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        element.text('this is the test directive');
      }
    };
  });