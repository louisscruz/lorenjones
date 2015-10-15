'use strict';

angular.module('lorenjonesApp')
  .directive('validUrl', ['cleanUrl', '$http', '$q', 'soundcloud', function (cleanUrl, $http, $q, soundcloud) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$asyncValidators.validUrl = function(url) {
          return soundcloud.testLoad(url);
        };
      }
    };
  }]);
