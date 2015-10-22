'use strict';
/*jshint camelcase: false */
angular.module('lorenjonesApp')
  .directive('uniqueUrl', ['cleanUrl', 'works', function (cleanUrl, works) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, $attr, $elem, ctrl) {
        ctrl.$validators.uniqueUrl = function(value) {
          console.log('running');
          if (value) {
            console.log('there is a value');
            var u = cleanUrl(value);
            if (works.cachedWork.audio === value || works.cachedWork.audio === u) {
              console.log('returning true');
              return true;
            }
            /*for (var i = 0; i < $scope.player.tracks.length; i++) {
              if ($scope.player.tracks[i].permalink_url === u || $scope.player.tracks[i].permalink_url === value) {
                return false;
              }
            }*/
            for (var i = 0; i < works.worksTracks.length; i++) {
              if (works.worksTracks[i] === u || works.worksTracks[i] === value) {
                return false;
              }
            }
            var dbwMovements = works.dbwMovements;
            for (var y = 0; y < dbwMovements.length; y++) {
              if (dbwMovements[y].audio === u || dbwMovements[y].audio === value) {
                return false;
              }
            }
          }
          return true;
        };
      }
    };
  }]);
