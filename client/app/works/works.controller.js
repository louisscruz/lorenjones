'use strict';

angular.module('lorenjonesApp')
  .controller('WorksCtrl', function ($scope) {
    $scope.info = '';
    $scope.toggle = function(id) {
      if (id !== '') {
        $scope.info = id;
      } else {
        $scope.info = '';
      }
    };
  });
