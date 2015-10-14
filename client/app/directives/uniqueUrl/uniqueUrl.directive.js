'use strict';
/*jshint camelcase: false */
angular.module('lorenjonesApp')
  .directive('uniqueUrl', ['cleanUrl', function (cleanUrl) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $attr, $elem, ctrl) {
        ctrl.$validators.uniqueUrl = function(value) {
          if (value) {
            var u = cleanUrl(value);
            for (var i = 0; i < $scope.player.tracks.length; i++) {
              if ($scope.player.tracks[i].permalink_url === u || $scope.player.tracks[i].permalink_url === value) {
                return false;
              }
            }
          }
          return true;
        };
      }
    };
  }]);
