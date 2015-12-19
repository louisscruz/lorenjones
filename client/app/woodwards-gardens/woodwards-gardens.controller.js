'use strict';

angular.module('lorenjonesApp')
  .controller('WoodwardsGardensCtrl', function ($scope) {
    $scope.rossThompson = [9, 10, 11];
    $scope.notLoren = function(index) {
      if (_.indexOf($scope.rossThompson, index) !== -1) {
        return true
      }
      return false
    }
  });
