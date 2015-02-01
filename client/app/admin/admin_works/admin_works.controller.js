'use strict';

angular.module('louiscruzApp')
  .controller('AdminWorksCtrl', function ($scope, $http, socket) {
    $scope.works = [];

    $http.get('/api/works').success(function(works) {
      $scope.works = works;
      socket.syncUpdates('work', $scope.works);
    });

    $scope.addWork = function() {
      if($scope.newTitle === '' || $scope.newCategory === '' ) {
        return;
      }
      $http.post('/api/works', {
        title: $scope.newTitle,
        category: $scope.newCategory
      });
      $scope.newTitle = '';
      $scope.newCategory = '';
    };

    $scope.deleteWork = function(work) {
      $http.delete('/api/works/' + work._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('work');
    });
  });
