'use strict';

angular.module('lorenjonesApp')
  .controller('AdminPlaylistCtrl', function ($scope, $rootScope, $http, socket, works, soundcloud, Modal) {
    $scope.show = works.defaultTrack;
    $scope.sortableOptions = {
      'ui-floating': true,
      stop: function(e, ui) {
        console.log($scope.worksOrder);
        var order = $scope.worksOrder;
        works.updateWorksOrder(order)
        .then(function() {
          console.log('yippee');
          works.getWorksOrder();
          //works.loadAll();
        })
        .then(function() {
          works.loadAll();
        });
      }
    };
    $scope.defaultTrack = works.defaultTrack;
    $scope.postDefaultTrack = function(track) {
      works.addDefaultTrack(track);
      $scope.newLink = '';
    }
    $scope.updateDefaultTrack = function(track) {
      works.updateDefaultTrack(track).success(function() {
        $scope.defaultTrack = works.defaultTrack;
        $scope.newLink = '';
      }).error(function() {
        works.loadSoundcloudPlayer;
      });
    };
    $scope.deleteDefaultTrack = function() {
      works.deleteDefaultTrack();
    };
    $scope.addDefaultTrack = function() {
      if($scope.newLink === '') {return};
      var track = {
        link: $scope.newLink
      };
      if($scope.defaultTrack.length === 0) {
        console.log('adding a default track');
        $scope.postDefaultTrack(track);
      } else {
        console.log('updating the current default track');
        $scope.updateDefaultTrack(track);
      }
    };
    $scope.confirmDelete = Modal.confirm.delete(function() {
      $scope.deleteDefaultTrack();
    });
  });
