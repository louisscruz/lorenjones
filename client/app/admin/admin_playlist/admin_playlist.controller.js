'use strict';

angular.module('lorenjonesApp')
  .controller('AdminPlaylistCtrl', function ($scope, $http, socket) {
    //$scope.tracks = [];
    //$http.get('/api/default_tracks').success(function(tracks) {
      //$scope.tracks = tracks;
      //socket.syncUpdates('default_track', $scope.tracks);
    //});
    $scope.sortableOptions = {
      stop: function(e, ui) {
        var logEntry = tmpList.map(function(i) {
          return i.value;
        }).join(', ');
        alert(ui);
      }
    }
    $scope.updateDefaultTrack = function(track) {
      return $http.put('/api/default_tracks/' + track._id, {
        link: $scope.newLink
      });
    };
    $scope.addDefaultTrack = function() {
      if($scope.newLink === '') {
        return;
      }
      if($scope.tracks.length === 0) {
        $http.post('/api/default_tracks', {
          link: $scope.newLink
        });
        $scope.newLink = '';
      } else {
        var track = $scope.tracks[0];
        $scope.updateDefaultTrack(track);
      }
    };
  });
