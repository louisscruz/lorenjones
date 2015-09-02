'use strict';

angular.module('lorenjonesApp')
  .controller('AdminWorksCtrl', function ($scope, $http, socket, Modal, works, $q, soundcloud) {
    $scope.works = works.works;
    $scope.currentYear = new Date().getFullYear();
    var initDate = false;
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
        $scope.newDate = '';
        $scope.newScore = '';
        $scope.newAudio = '';
        $scope.worksForm.$setUntouched();
      }
    };
    $scope.cacheWork = works.cacheWork;
    $scope.updateWork = works.updateWork;
    $scope.checkUrl = function(data) {
      if ($scope.worksTracks.indexOf(data) !== -1) {
        return 'This tracks is already loaded in the player.';
      }
      var deferred = $q.defer();
      soundcloud.testLoad(data).then(function() {
        deferred.resolve();
      }, function() {
        deferred.reject('Invalid Soundcloud URL');
      });
      return deferred.promise;
    };
    $scope.clearWorkTrack = function(work) {
      works.cacheWork(work);
      work.audio = '';
      console.log(work);
      works.updateWork(work);
    };
    $scope.initDate = function(touched) {
      if (!touched && !initDate) {
        initDate = true;
        return $scope.newDate = $scope.currentYear;
      }
    };
    $scope.confirmDelete = Modal.confirm.delete(function(work) {
      works.deleteWork(work);
    });
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('work');
    });
  });
