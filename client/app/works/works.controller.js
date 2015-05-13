'use strict';

angular.module('louiscruzApp')
  .controller('WorksCtrl', function ($scope) {
    $scope.toggle = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
  });
