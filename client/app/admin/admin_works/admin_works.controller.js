'use strict';

angular.module('lorenjonesApp')
  .controller('AdminWorksCtrl', function ($scope, $http, socket, Modal, works, $q, soundcloud) {
    $scope.works = works.works;
    $scope.currentYear = new Date().getFullYear();
    $scope.groups = [
      'Solo',
      'Chamber',
      'Orchestral',
      'Band',
      'Wind Ensemble',
      'Vocal',
      'Choral',
      'Opera'
    ];
    $scope.addWork = function(isValid) {
      if (isValid) {
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
    //$scope.updateWork = function(work) {
      //console.log(work);
      /*return $http.put('/api/works/' + work._id, {
        title: work.title,
        category: work.category,
        date: work.date,
        instrumentation: work.instrumentation,
        info: work.info,
        link: work.link,
        audio: work.audio,
        video: work.video
      });*/
    //};
    $scope.cacheWork = works.cacheWork;
    $scope.updateWork = works.updateWork;
    $scope.checkUrl = function(data) {
      if ($scope.worksTracks.indexOf(data) !== -1) {
        return 'This tracks is already loaded in the player.';
      }
      var d = $q.defer();
      soundcloud.testLoad(data).success(function() {
        d.resolve();
      }).error(function() {
        d.reject('Invalid URL');
      });
      return d.promise;
    };
    $scope.clearWorkTrack = function(work) {
      works.cacheWork(work);
      work.audio = '';
      console.log(work);
      works.updateWork(work);
    };
    $scope.confirmDelete = Modal.confirm.delete(function(work) {
      works.deleteWork(work);
    });
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('work');
    });
  });
