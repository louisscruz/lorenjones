'use strict';

angular.module('lorenjonesApp')
  .controller('AdminPlaylistCtrl', function ($scope, $rootScope, $http, socket, works, soundcloud, Modal) {
    $scope.sortableOptions = {
      'ui-floating': true,
      stop: function() {
        console.log()
      }
    };
    $scope.defaultTrack = works.defaultTrack;
    $scope.postDefaultTrack = function(track) {
      console.log(track);
      soundcloud.dumpData();
      works.addDefaultTrack(track).success(function() {
        works.loadSoundcloudPlayer;
        $scope.defaultTrack = works.defaultTrack;
        $scope.newLink = '';
      })
    }
    $scope.updateDefaultTrack = function(track) {
      soundcloud.dumpData();
      works.updateDefaultTrack(track).success(function() {
        works.loadSoundcloudPlayer;
        $scope.defaultTrack = works.defaultTrack;
        $scope.newLink = '';
      }).error(function() {
        works.loadSoundcloudPlayer;
      });
    };
    $scope.deleteDefaultTrack = function() {
      soundcloud.dumpData();
      works.deleteDefaultTrack().success(function() {
        works.loadSoundcloudPlayer;
      });
    };
    $scope.addDefaultTrack = function() {
      if($scope.newLink === '') {return};
      var track = {
        link: $scope.newLink
      };
      if($scope.defaultTrack.length === 0) {
        $scope.postDefaultTrack(track);
      } else {
        $scope.updateDefaultTrack(track);
      }
    };
    $scope.confirmDelete = Modal.confirm.delete(function() {
      $scope.deleteDefaultTrack();
    });
  });
