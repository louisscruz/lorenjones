'use strict';

angular.module('lorenjonesApp')
  .controller('AdminPlaylistCtrl', function ($scope, $http, socket, works, Modal) {
    $scope.sortableOptions = {
      //alert('Working');
    };
    $scope.updateDefaultTrack = function(track) {
      works.updateDefaultTrack(track);
    };
    $scope.addDefaultTrack = function() {
      if($scope.newLink === '') {
        return;
      }
      if($scope.defaultTrack.length === 0) {
        $http.post('/api/default_tracks', {
          link: $scope.newLink
        });
        $scope.newLink = '';
      } else {
        var track = {
          link: $scope.newLink
        }
        $scope.updateDefaultTrack(track);
      }
    };
    $scope.deleteDefaultTrack = function() {
      works.deleteDefaultTrack;
    };
    $scope.confirmDelete = Modal.confirm.delete(function() {
      $scope.deleteDefaultTrack();
    });
  });
