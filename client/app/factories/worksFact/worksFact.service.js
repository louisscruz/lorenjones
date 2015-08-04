'use strict';

angular.module('lorenjonesApp')
  .factory('works', ['$http', '$rootScope', 'socket', 'soundcloud', function ($http, $rootScope, socket, soundcloud) {
    var fact = { works: [], tracks: [], dbwMovements: [], defaultTrack: [] };

    $http.get('/api/default_tracks').success(function(tracks) {
      fact.tracks.push(tracks[0].link);
      if (tracks !== null) {
        fact.defaultTrack.push(tracks[0].link)
        angular.copy(tracks, fact.defaultTrack)
      }
    });

    $http.get('/api/works').success(function(works) {
      angular.copy(works, fact.works)
      for (var i = 0; i < works.length; i++) {
        if (works[i].audio) {
          fact.tracks.push(works[i].audio);
        }
      }
      socket.syncUpdates('work', fact.works);
    });

    $http.get('/api/dbw_movements').success(function(movements) {
      angular.copy(movements, fact.dbwMovements)
      for (var i = 0; i < movements.length; i++) {
        fact.tracks.push(movements[i].audio);
      }
      angular.forEach(fact.tracks, function(value, key) {
        console.log(value);
        soundcloud.loadPlayerWith(value, key);
      });
      //for (var i = 0; i < fact.tracks.length; i++) {
        //soundcloud.loadPlayerWith(fact.tracks[i], i);
      //}
    });

    // Delete the default track
    function deleteDefaultTrack() {
      return $http.delete('/api/default_tracks/' + fact.defaultTrack[0]._id).success(function(data) {
        fact.tracks.splice(0, 1);
        fact.defaultTrack.splice(0, 1);
      });
    };

    // Update the default track
    function updateDefaultTrack(track) {
      return $http.patch('/api/default_tracks/' + fact.defaultTrack[0]._id, track).success(function(data) {
        //angular.copy(data, fact.defaultTrack[0]);
        fact.defaultTrack[0] = data;
        //angular.copy(data.link, fact.tracks[0]);
        fact.tracks[0] = data.link;
        $rootScope.$broadcast('tracksChanged');
      });
    };

    // Sort the track order if /api/playlist returns a valuable
    $http.get('/api/playlists').success(function(playlist) {
      //
    });
    //return fact;
    return {
      works: fact.works,
      tracks: fact.tracks,
      dbwMovements: fact.dbwMovements,
      defaultTrack: fact.defaultTrack,
      deleteDefaultTrack: deleteDefaultTrack,
      updateDefaultTrack: updateDefaultTrack
    };
  }]);
