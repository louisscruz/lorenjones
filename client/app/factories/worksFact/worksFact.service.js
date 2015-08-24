'use strict';
/*jshint shadow: true*/
angular.module('lorenjonesApp')
  .factory('works', ['$http', '$rootScope', 'socket', 'soundcloud', 'cleanUrl', function ($http, $rootScope, socket, soundcloud, cleanUrl) {
    var fact = { defaultTrack: [], works: [], dbwMovements: [], worksTracks: [], worksOrder: [] };
    var cachedWork;
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
        // if you visit the playlist page, change the order, and return to the works page, the worksTracks will be overpopulated
        $http.get('/api/works').success(function(works) {
          angular.copy(works, fact.works);
          var worksTracks = [];
          var playlistIndex;
          var defaultTrack = false;
          var count = 0;
          var order = fact.worksOrder;
          if (index === 1) {
            order = order.map(function(x) {
              return x + 1;
            });
            defaultTrack = true;
            count = 1;
          }
          for (var i = 0; i < fact.works.length; i++) {
            if (fact.works[i].audio) {
              worksTracks.push(fact.works[i].audio);
              if (defaultTrack) {
                playlistIndex = order.indexOf(count) + 1;
              } else {
                playlistIndex = order.indexOf(count);
              }
              soundcloud.loadPlayerWith(works[i].audio, playlistIndex);
              index++;
              count++;
            }
          }
          angular.copy(worksTracks, fact.worksTracks);
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
    }
    // Add default track
    function addDefaultTrack(track) {
      return $http.post('/api/default_tracks/', {link: track.link}).success(function() {
        angular.copy(track, fact.defaultTrack);
      })
      .then(function() {
        loadAll();
      });
    }
    // Delete the default track
    function deleteDefaultTrack() {
      return $http.delete('/api/default_tracks/' + fact.defaultTrack[0]._id).success(function() {
        fact.defaultTrack.splice(0, 1);
      })
      .then(function() {
        loadAll();
      });
    }
    // Update the default track
    function updateDefaultTrack(track) {
      return $http.patch('/api/default_tracks/' + fact.defaultTrack[0]._id, {link: track.link}).success(function() {
        fact.defaultTrack[0].link = track.link;
        loadAll();
      });
    }
    // Add work
    function addWork(work) {
      return $http.post('/api/works', work).success(function() {
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
    }
    // Update work
    function updateWork(work) {
      var naturalPlacement;
      var reorder = fact.worksOrder;
      var count = 0;
      var trackUpdate = {
        title: work.title,
        category: work.category,
        date: work.date,
        instrumentation: work.instrumentation,
        info: work.info,
        link: work.link,
        audio: work.audio,
        video: work.video
      };
      if (!cachedWork) {
        // If no track previously associated with the work, add a track and update the playlist
        for (var i = 0, len = fact.works.length; i < len; i++) {
          if (fact.works[i].audio) {
            if (fact.works[i]._id === work._id) {
              naturalPlacement = count;
              break;
            }
            count++;
          }
        }
        //Update the work with the track then update the playlist
        $http.patch('/api/works/' + work._id, trackUpdate)
        .success(function() {
          for (var i = 0, len = reorder.length; i < len; i++) {
            // Check that this loop catches the right playlist values/indexes when work is not naturally last.
            if (reorder[i] >= naturalPlacement) {
              reorder[i] += 1;
            }
          }
          reorder.push(naturalPlacement);
          updateWorksOrder(reorder);
        })
        .then(function() {
          loadAll();
        });
      } else {
        if (!work.audio) {
          for (var y = 0, len = fact.works.length; y < len; y++) {
            if (fact.works[y]._id === work._id) {
              naturalPlacement = count;
            }
            count++;
          }
          $http.patch('/api/works/' + work._id, trackUpdate)
          .success(function() {
            reorder.splice(reorder.indexOf(naturalPlacement), 1);
            for (var i = 0, len = reorder.length; i < len; i++) {
              // Check that this loop catches the right playlist values/indexes when work is not naturally last.
              if (reorder[i] > naturalPlacement) {
                reorder[i] -= 1;
              }
            }
            fact.worksTracks.splice(cachedWork, 1);
            updateWorksOrder(reorder);
          })
          .then(function() {
            loadAll();
          });
        } else {
          // Update the work track without updating the playlist
          $http.patch('/api/works/' + work._id, trackUpdate)
          .success(function() {
            loadAll();
          });
        }
      }
    }
    // Delete work
    function deleteWork(work) {
      return $http.delete('/api/works/' + work._id).success(function() {
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
    }
    // Cache old work values
    function cacheWork(data) {
      cachedWork = data.audio;
      //return cachedWork;
    }
    // Unique work audio
    function uniqueUrl(value) {
      /*jshint camelcase: false*/
      if (value) {
        var u = cleanUrl(value);
        for (var i = 0; i < $rootScope.player.tracks.length; i++) {
          if ($rootScope.player.tracks[i].permalink_url === u) {
            return false;
          }
        }
      }
      return true;
    }
    // Get the playlist order
    function getWorksOrder() {
      return $http.get('/api/playlists').success(function(data) {
        console.log(data);
        angular.copy(data.order, fact.worksOrder);
      });
    }
    // Update the playlist order
    function updateWorksOrder(o) {
      return $http.patch('/api/playlists', {order: o}).success(function() {
        fact.worksOrder = o;
      });
    }
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
      updateWork: updateWork,
      deleteWork: deleteWork,
      cacheWork: cacheWork,
      uniqueUrl: uniqueUrl,
      // Playlist order functions
      getWorksOrder: getWorksOrder,
      updateWorksOrder: updateWorksOrder
    };
  }]);
