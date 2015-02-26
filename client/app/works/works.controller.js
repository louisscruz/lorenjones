'use strict';

angular.module('louiscruzApp')
  .controller('WorksCtrl', function ($scope, $http, socket) {
    $scope.works = [];
    $scope.theBestVideo = 'sMKoNBRZM1M';

    $http.get('/api/works').success(function(works) {
      $scope.works = works;
      socket.syncUpdates('work', $scope.works);
    });
  });
