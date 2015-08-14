'use strict';

angular.module('lorenjonesApp')
  .controller('AdminWorksCtrl', function ($scope, $http, socket, Modal, works) {
    $scope.works = works.works;
    $scope.currentYear = new Date().getFullYear();
    $scope.groups = [
      'Solo',
      'Chamber',
      'Orchestral',
      'Wind Ensemble',
      'Vocal',
      'Choral',
      'Opera'
    ];
    $scope.addWork = function(isValid) {
      if(isValid) {
        var work = {
          title: $scope.newTitle,
          category: $scope.newCategory,
          date: $scope.newDate,
          instrumentation: $scope.newInstrumentation,
          info: $scope.newInfo,
          link: $scope.newLink,
          audio: $scope.newAudio,
          video: $scope.newVideo
        };
        works.addWork(work);
        $scope.newTitle = '';
        $scope.newCategory = '';
        $scope.newDate = '2015';
        $scope.newScore = '';
        $scope.newAudio = '';
      }
    };

    $scope.updateWork = function(work) {
      return $http.put('/api/works/' + work._id, {
        title: work.title,
        category: work.category,
        date: work.date,
        instrumentation: work.instrumentation,
        info: work.info,
        link: work.link,
        audio: work.audio,
        video: work.video
      });
    };

    $scope.confirmDelete = Modal.confirm.delete(function(work) {
      works.deleteWork(work);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('work');
    });
  });
