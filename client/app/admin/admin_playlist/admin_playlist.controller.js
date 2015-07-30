'use strict';

angular.module('lorenjonesApp')
  .controller('AdminPlaylistCtrl', function ($scope, $http, socket, works, Modal) {
    $scope.defaultTrack = [];
    $http.get('/api/default_tracks').success(function(tracks) {
      $scope.defaultTrack = tracks;
      socket.syncUpdates('default_track', $scope.defaultTrack);
    });
    $scope.sortableOptions = {
      //alert('Working');
    };
    $scope.updateDefaultTrack = function(track) {
      $http.put('/api/default_tracks/' + track._id, {
        link: $scope.newLink
      });
      $scope.newLink = '';
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
        var track = $scope.defaultTrack[0];
        $scope.updateDefaultTrack(track);
      }
    };
    $scope.deleteDefaultTrack = function() {
      $http.get('/api/default_tracks').success(function(tracks) {
        var d = tracks[0];
        $http.delete('/api/default_tracks/' + d._id);
        $scope.defaultTrack = [];
      });
    };
    $scope.confirmDelete = Modal.confirm.delete(function() {
      $scope.deleteDefaultTrack();
    });
  });
