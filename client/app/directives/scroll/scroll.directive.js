'use strict';

angular.module('lorenjonesApp')
  .directive('scroll', function ($window) {
    return {
      restrict: 'A',
      link: function (scope) {
        angular.element($window).bind('scroll', function() {
          if (this.pageYOffset >= 50) {
            scope.scrolled = true;
          } else {
            scope.scrolled = false;
          }
          scope.$apply();
        });
      }
    };
  });
