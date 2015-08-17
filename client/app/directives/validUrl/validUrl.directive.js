'use strict';

angular.module('lorenjonesApp')
  .directive('validUrl', ['cleanUrl', '$http', '$q', 'soundcloud', function (cleanUrl, $http, $q, soundcloud) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $attr, $elem, ctrl) {
        ctrl.$asyncValidators.validUrl = function(url) {
          return soundcloud.testLoad(url);
        }
      }
    };
  }]);
