'use strict';
angular.module('lorenjonesApp')
  .factory('works', ['$http', '$rootScope', 'socket', 'soundcloud', function ($http, $rootScope, socket, soundcloud) {
    var fact = { defaultTrack: [], works: [], dbwMovements: [], worksTracks: [], worksOrder: [] };
    // var order = null;
    // Get all works and tracks; send tracks to soundcloud player
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
        //fact.worksTracks = [];
        // if you visit the playlist page, change the order, and return to the works page, the worksTracks will be overpopulated
        $http.get('/api/works').success(function(works) {
          angular.copy(works, fact.works);
          var playlistIndex;
          var defaultTrack = false;
          var count = 0;
          var order = fact.worksOrder;
          console.log(order)
          if (index === 1) {
            console.log('index is 1')
            order = order.map(function(x) {
              return x + 1;
            });
            defaultTrack = true;
            count = 1;
            console.log(order);
          }
          console.log(fact.works)
          console.log(fact.worksTracks)
          for (var i = 0; i < fact.works.length; i++) {
            if (fact.works[i].audio) {
              fact.worksTracks.push(fact.works[i].audio);
              if (defaultTrack) {
                console.log('test');
                playlistIndex = order.indexOf(count) + 1;
              } else {
                playlistIndex = order.indexOf(count);
                console.log(playlistIndex)
              }
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
    // Add work
    function addWork(work) {
      return $http.post('/api/works', work).success(function(data) {
        if (work.audio) {
          var newOrder;
          if (!fact.worksOrder) {
            newOrder = [0];
          } else {
            var length = fact.worksOrder.length;
            newOrder = fact.worksOrder;
            newOrder.push(length);
          }
          updateWorksOrder(newOrder);
        }
      })
      .then(function() {
        loadAll();
      });
    };
    // Delete work
    function deleteWork(work) {
      return $http.delete('/api/works/' + work._id).success(function(data) {
        if (work.audio) {
          var naturalPosition = fact.worksTracks.indexOf(work.audio);
          var playlistIndex = fact.worksOrder.indexOf(naturalPosition);
          var playlistValue = fact.worksOrder[playlistIndex];
          var order = fact.worksOrder;
          order.splice(playlistIndex, 1);
          for (var i = 0, len = order.length; i < len; i++) {
            if (order[i] > playlistValue) {
              order[i]--;
            }
          }
          updateWorksOrder(order);
          loadAll();
        }
      });
    };
    // Get the playlist order
    function getWorksOrder() {
      return $http.get('/api/playlists').success(function(data) {
        console.log(data);
        angular.copy(data.order, fact.worksOrder)
      });
    };
    // Update the playlist order
    function updateWorksOrder(o) {
      return $http.patch('/api/playlists', {order: o}).success(function(data) {
        fact.worksOrder = o;
      });
    };
    // Update the player order by Playlist
    function updatePlayerOrder() {

    };
    return {
      loadAll: loadAll,
      // Resources
      works: fact.works,
      dbwMovements: fact.dbwMovements,
      defaultTrack: fact.defaultTrack,
      worksTracks: fact.worksTracks,
      worksOrder: fact.worksOrder,
      // Default track functions
      addDefaultTrack: addDefaultTrack,
      deleteDefaultTrack: deleteDefaultTrack,
      updateDefaultTrack: updateDefaultTrack,
      // Works functions
      addWork: addWork,
      deleteWork: deleteWork,
      // Playlist order functions
      getWorksOrder: getWorksOrder,
      updateWorksOrder: updateWorksOrder,
      updatePlayerOrder: updatePlayerOrder
    };
  }]);
