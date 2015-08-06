'use strict';

angular.module('lorenjonesApp')
  .factory('works', ['$http', '$rootScope', 'socket', 'soundcloud', function ($http, $rootScope, socket, soundcloud) {
    var fact = { defaultTrack: [], works: [], dbwMovements: [] };
    $http.get('/api/default_tracks').success(function(tracks) {
      if (tracks) {
        angular.copy(tracks, fact.defaultTrack);
      }
    })
    .then(function() {
      $http.get('/api/works').success(function(works) {
        angular.copy(works, fact.works);
        socket.syncUpdates('work', fact.works);
      });
    })
    .then(function() {
      $http.get('/api/dbw_movements').success(function(movements) {
        angular.copy(movements, fact.dbwMovements);
        loadSoundcloudPlayer();
      });
    });
    // Send tracks to soundcloudPlayer to be loaded
    function loadSoundcloudPlayer() {
      // Load default track
      if (fact.defaultTrack[0].link) {
        soundcloud.loadPlayerWith(fact.defaultTrack[0].link);
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
        for (var i = 0; i < fact.dbwMovements.length; i++) {
          soundcloud.loadPlayerWith(fact.dbwMovements[i].audio);
        }
      }
    };
    // Add default track
    function addDefaultTrack(track) {
      return $http.post('/api/default_tracks/', {link: track.link}).success(function(data) {
        fact.defaultTrack[0].link = track.link;
        loadSoundcloudPlayer();
      });
    }
    // Delete the default track
    function deleteDefaultTrack() {
      return $http.delete('/api/default_tracks/' + fact.defaultTrack[0]._id).success(function(data) {
        fact.defaultTrack.splice(0, 1);

      });
    };
    // Update the default track
    function updateDefaultTrack(track) {
      console.log('in the works fact update');
      return $http.patch('/api/default_tracks/' + fact.defaultTrack[0]._id, {link: track.link}).success(function(data) {
        fact.defaultTrack[0].link = track.link;
        loadSoundcloudPlayer();
      });
    };
    // Get all works tracks
    function getWorksTracks() {
      var tmp = [];
      for (var i = 0; i < fact.works.length; i++) {
        console.log('in the for loop');
        if (fact.works[i].audio) {
          console.log(fact.works[i]);
          tmp.push(fact.works[i]);
        }
      }
      return tmp;
    }
    // Sort the track order if /api/playlist returns a valuable
    $http.get('/api/playlists').success(function(playlist) {
      //
    });
    //return fact;
    return {
      works: fact.works,
      worksTracks: getWorksTracks,
      dbwMovements: fact.dbwMovements,
      defaultTrack: fact.defaultTrack,
      addDefaultTrack: addDefaultTrack,
      deleteDefaultTrack: deleteDefaultTrack,
      updateDefaultTrack: updateDefaultTrack,
      loadSoundcloudPlayer: loadSoundcloudPlayer
    };
  }]);
