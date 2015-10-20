'use strict';
/*jshint camelcase: false */
angular.module('lorenjonesApp')
  .directive('uniqueUrl', ['cleanUrl', 'works', function (cleanUrl, works) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $attr, $elem, ctrl) {
        ctrl.$validators.uniqueUrl = function(value) {
          if (value) {
            var u = cleanUrl(value);
            if (works.cachedWork.audio === value || works.cachedWork.audio === u) {
              return true;
            }
            for (var i = 0; i < $scope.player.tracks.length; i++) {
              var playerTrack = $scope.player.tracks[i].permalink_url;
              if (playerTrack === u || playerTrack === value) {
                return false;
              }
            }
            var dbwMovements = works.dbwMovements;
            for (var y = 0; y < dbwMovement.length; y++) {
              var dbwAudio = dbwMovements[y].audio;
              if (dbwAudio === u || dbwAudio === value) {
                return false;
              }
            }
          }
          return true;
        };
      }
    };
  }]);
