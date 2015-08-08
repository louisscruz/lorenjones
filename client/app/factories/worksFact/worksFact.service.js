'use strict';

angular.module('lorenjonesApp')
  .factory('works', ['$http', '$rootScope', 'socket', 'soundcloud', function ($http, $rootScope, socket, soundcloud) {
    var fact = { defaultTrack: [], works: [], dbwMovements: [], tracks: [] };
    // Get all tracks and send them to fact.tracks
    function loadAll() {
      var index = 0;
      $http.get('/api/default_tracks').success(function(tracks) {
        if (tracks) {
          angular.copy(tracks, fact.defaultTrack);
          fact.tracks.push(tracks[0].link);
          soundcloud.loadPlayerWith(tracks[0].link, index);
          index++;
        }
      })
      .then(function() {
        $http.get('/api/works').success(function(works) {
          angular.copy(works, fact.works);
          var playlistIndex = null;
          var count = 0;
          var order = $rootScope.worksOrder;
          if (index === 1) {
            order = order.map(function(x) {
              return x + 1;
            });
          }
          for (var i = 0; i < fact.works.length; i++) {
            if (fact.works[i].audio) {
              fact.tracks.push(works[i].audio);
              playlistIndex = (order[count]) || index;
              soundcloud.loadPlayerWith(works[i].audio, playlistIndex);
              index++;
              count++;
            }
          }
          socket.syncUpdates('work', fact.works);
        });
      })
      .then(function() {
        $http.get('/api/dbw_movements').success(function(movements) {
          angular.copy(movements, fact.dbwMovements);
          for (var i = 0; i < fact.dbwMovements.length; i++) {
            if (fact.dbwMovements[i].audio) {
              fact.tracks.push(movements[i].audio);
              soundcloud.loadPlayerWith(movements[i].audio, index);
              index++;
            }
          }
        });
      });
      //.then(function() {
        //return fact.tracks;
      //});
    };
    // Send all tracks to the soundcloud factory to be loaded
    function loadSoundcloudPlayer() {
      for (var i = 0; i < fact.tracks.length; i++) {
        soundcloud.loadPlayerWith(fact.tracks[i]);
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
      return $http.patch('/api/default_tracks/' + fact.defaultTrack[0]._id, {link: track.link}).success(function(data) {
        fact.defaultTrack[0].link = track.link;
        loadSoundcloudPlayer();
      });
    };
    // Sort the track order if /api/playlist returns a valuable
    $http.get('/api/playlists').success(function(playlist) {
      //
    });
    //return fact;
    return {
      loadAll: loadAll,
      loadSoundcloudPlayer: loadSoundcloudPlayer,
      works: fact.works,
      dbwMovements: fact.dbwMovements,
      defaultTrack: fact.defaultTrack,
      addDefaultTrack: addDefaultTrack,
      deleteDefaultTrack: deleteDefaultTrack,
      updateDefaultTrack: updateDefaultTrack
    };
  }]);
