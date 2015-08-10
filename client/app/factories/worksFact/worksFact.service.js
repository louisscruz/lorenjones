'use strict';

angular.module('lorenjonesApp')
  .factory('works', ['$http', '$rootScope', 'socket', 'soundcloud', function ($http, $rootScope, socket, soundcloud) {
    var fact = { defaultTrack: [], works: [], dbwMovements: [], tracks: [] };
    // Get all tracks and send them to fact.tracks
    function loadAll() {
      soundcloud.dumpData;
      var index = 0;
      $http.get('/api/default_tracks').success(function(t) {
        console.log(t[0]);
        if (t[0]) {
          angular.copy(t, fact.defaultTrack);
          soundcloud.loadPlayerWith(t[0].link, index);
          index++;
        }
        console.log(index);
      })
      .then(function() {
        $http.get('/api/works').success(function(works) {
          console.log(index);
          angular.copy(works, fact.works);
          var playlistIndex = null;
          var count = 0;
          var order = $rootScope.worksOrder;
          if (index === 1) {
            order = order.map(function(x) {
              return x + 1;
            });
          }
          console.log(order);
          for (var i = 0; i < fact.works.length; i++) {
            if (fact.works[i].audio) {
              playlistIndex = (order[count]);
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
              soundcloud.loadPlayerWith(movements[i].audio, index);
              index++;
            }
          }
        });
      });
    };
    // Add default track
    function addDefaultTrack(track) {
      return $http.post('/api/default_tracks/', {link: track.link}).success(function(data) {
        //fact.defaultTrack[0] = track.link;
        angular.copy(track, fact.defaultTrack);
      })
      .then(function() {
        loadAll();
      });
    }
    // Delete the default track
    function deleteDefaultTrack() {
      console.log($rootScope.player.tracks);
      return $http.delete('/api/default_tracks/' + fact.defaultTrack[0]._id).success(function(data) {
        fact.defaultTrack.splice(0, 1);
      })
      .then(function() {
        loadAll();
      });
    };
    // Update the default track
    function updateDefaultTrack(track) {
      return $http.patch('/api/default_tracks/' + fact.defaultTrack[0]._id, {link: track.link}).success(function(data) {
        fact.defaultTrack[0].link = track.link;
        loadAll();
      });
    };
    // Sort the track order if /api/playlist returns a valuable
    $http.get('/api/playlists').success(function(playlist) {
      //
    });
    //return fact;
    return {
      loadAll: loadAll,
      works: fact.works,
      dbwMovements: fact.dbwMovements,
      defaultTrack: fact.defaultTrack,
      addDefaultTrack: addDefaultTrack,
      deleteDefaultTrack: deleteDefaultTrack,
      updateDefaultTrack: updateDefaultTrack
    };
  }]);
