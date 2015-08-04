'use strict';

angular.module('lorenjonesApp')
  .factory('works', ['$http', '$rootScope', 'socket', 'soundcloud', function ($http, $rootScope, socket, soundcloud) {
    var fact = { works: [], tracks: [], dbwMovements: [], defaultTrack: [] };

    $http.get('/api/default_tracks').success(function(tracks) {
      if (tracks !== null) {
        angular.copy(tracks, fact.defaultTrack);
      }
    });
    $http.get('/api/works').success(function(works) {
      angular.copy(works, fact.works)
      socket.syncUpdates('work', fact.works);
    });
    $http.get('/api/dbw_movements').success(function(movements) {
      angular.copy(movements, fact.dbwMovements)
    });
    // Send tracks to soundcloudPlayer in correct order
    function loadSoundcloudPlayer() {
      // Load default track
      if (fact.defaultTrack) {
        soundcloud.loadPlayerWith(fact.defaultTrack[0].link, 0);
      }
      // Load works
      for (var i = 0; i < fact.works.length; i++) {
        // Todo: If playlist order, load in that order!!!
        if (fact.works[i].audio) {
          soundcloud.loadPlayerWith(fact.works[i].audio);
        }
      }
      // Load dbw movements
      if (fact.dbwMovements) {
        console.log('there are dbw movements');
        for (var i = 0; i < fact.dbwMovements.length; i++) {
          console.log(i);
          soundcloud.loadPlayerWith(fact.dbwMovements[i].audio);
        }
      }
      //for (var i = 0; i < fact.tracks.length; i++) {
        //soundcloud.loadPlayerWith(fact.tracks[i], i)
      //};
    };
    // Add default track
    function addDefaultTrack(track) {
      console.log('in the function');
      return $http.post('/api/default_tracks/', {link: track}).success(function(data) {
        fact.defaultTrack[0].link = track;
        fact.tracks[0] = data.link;
      });
    }
    // Delete the default track
    function deleteDefaultTrack() {
      return $http.delete('/api/default_tracks/' + fact.defaultTrack[0]._id).success(function(data) {
        fact.tracks.splice(0, 1);
        fact.defaultTrack.splice(0, 1);
        for (var i = 0; i < fact.tracks.length; i++) {
          soundcloud.loadPlayerWith(fact.tracks[i])
        }
      });
    };
    // Update the default track
    function updateDefaultTrack(track) {
      return $http.patch('/api/default_tracks/' + fact.defaultTrack[0]._id, track).success(function(data) {
        fact.defaultTrack[0] = data;
        fact.tracks[0] = data.link;
        //$rootScope.$emit('tracksChanged');
        loadSoundcloudPlayer();
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
      addDefaultTrack: addDefaultTrack,
      deleteDefaultTrack: deleteDefaultTrack,
      updateDefaultTrack: updateDefaultTrack,
      loadSoundcloudPlayer: loadSoundcloudPlayer
    };
  }]);
