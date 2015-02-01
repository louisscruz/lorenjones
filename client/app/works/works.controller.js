'use strict';

angular.module('louiscruzApp')
  .controller('WorksCtrl', function ($scope, $http, socket) {
    $scope.works = [];

    $http.get('/api/works').success(function(works) {
      $scope.works = works;
      socket.syncUpdates('work', $scope.works);
    });
  });
