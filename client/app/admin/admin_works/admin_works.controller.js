'use strict';

angular.module('louiscruzApp')
  .controller('AdminWorksCtrl', function ($scope, $http, socket) {
    $scope.works = [];
    $scope.groups = [
      'Solo',
      'Chamber',
      'Orchestral',
      'Vocal',
      'Choral',
      'Opera'
    ];

    $http.get('/api/works').success(function(works) {
      $scope.works = works;
      socket.syncUpdates('work', $scope.works);
    });

    $scope.addWork = function() {
      if($scope.newTitle === '' || $scope.newCategory === '' || $scope.newDate === '' ) {
        return;
      }
      $http.post('/api/works', {
        title: $scope.newTitle,
        category: $scope.newCategory,
        date: $scope.newDate,
        instrumentation: $scope.newInstrumentation,
        info: $scope.newInfo,
        link: $scope.newLink,
        audio: $scope.newAudio,
        video: $scope.newVideo
      });
      $scope.newTitle = '';
      $scope.newCategory = '';
      $scope.newDate = '2015';
      $scope.newScore = '';
      $scope.newAudio = '';
    };

    $scope.updateWork = function(work) {
      return $http.put('/api/works/' + work._id, {title: work.title});
    };

    $scope.deleteWork = function(work) {
      $http.delete('/api/works/' + work._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('work');
    });
  });
