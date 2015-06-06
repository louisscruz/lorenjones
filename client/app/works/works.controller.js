'use strict';

angular.module('lorenjonesApp')
  .controller('WorksCtrl', function ($scope) {
    $scope.toggle = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
  });
