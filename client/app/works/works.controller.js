'use strict';

angular.module('lorenjonesApp')
  .controller('WorksCtrl', function ($scope) {
    $scope.info = '';
    $scope.toggle = function(id) {
      if (id === '' || id !== $scope.info) {
        $scope.info = id;
      } else {
        $scope.info = '';
      }
    };
  });
