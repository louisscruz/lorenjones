'use strict';
angular.module('lorenjonesApp')
  .factory('works', ['$http', '$rootScope', 'socket', 'soundcloud', function ($http, $rootScope, socket, soundcloud) {
    var fact = { defaultTrack: [], works: [], dbwMovements: [], tracks: [], worksTracks: [], worksOrder: [] };
    var playlist_index = null;
    var order = null;
    // Get all tracks and send them to fact.tracks
    function loadAll() {
      soundcloud.dumpData();
      var index = 0;
      $http.get('/api/default_tracks').success(function(t) {
        if (t[0]) {
          angular.copy(t, fact.defaultTrack);
          soundcloud.loadPlayerWith(t[0].link, index);
          index++;
        }
      })
      .then(function() {
        getWorksOrder();
      })
      .then(function() {
        $http.get('/api/works').success(function(works) {
          angular.copy(works, fact.works);
          var playlistIndex = null;
          var count = 0;
          // why is fact.worksOrder not the updated value here?
          var order = fact.worksOrder;
          if (index === 1) {
            order = order.map(function(x) {
              return x + 1;
            });
          }
          for (var i = 0; i < fact.works.length; i++) {
            if (fact.works[i].audio) {
              fact.worksTracks.push(fact.works[i].audio);
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
        angular.copy(track, fact.defaultTrack);
      })
      .then(function() {
        loadAll();
      });
    };
    // Delete the default track
    function deleteDefaultTrack() {
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
    // Get the playlist order
    function getWorksOrder() {
      $http.get('/api/playlists').success(function(data) {
        playlist_index = data[0]._id;
        order = data[0].order;
        angular.copy(data[0].order, fact.worksOrder)
      });
      return fact.worksOrder;
    };
    // Update the playlist order
    function updateWorksOrder(o) {
      $http.patch('/api/playlists/' + playlist_index, {order: o}).success(function(data) {
        console.log(o);
        fact.worksOrder = o;
        console.log(fact.worksOrder);
      })
      .then(function() {

      });
      return fact.worksOrder;
    };
    // Update the player order by Playlist
    function updatePlayerOrder() {

    };
    //return fact;
    return {
      loadAll: loadAll,
      works: fact.works,
      dbwMovements: fact.dbwMovements,
      defaultTrack: fact.defaultTrack,
      worksTracks: fact.worksTracks,
      worksOrder: fact.worksOrder,
      addDefaultTrack: addDefaultTrack,
      deleteDefaultTrack: deleteDefaultTrack,
      updateDefaultTrack: updateDefaultTrack,
      getWorksOrder: getWorksOrder,
      updateWorksOrder: updateWorksOrder,
      updatePlayerOrder: updatePlayerOrder
    };
  }]);
