'use strict';
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
        //fact.worksTracks = [];
        // if you visit the playlist page, change the order, and return to the works page, the worksTracks will be overpopulated
        $http.get('/api/works').success(function(works) {
          angular.copy(works, fact.works);
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
              fact.worksTracks.push(fact.works[i].audio);
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
    // Update work
    function updateWork(work) {
      console.log(work);
      console.log(cachedWork);
      var reorder = fact.worksOrder;
      var count = 0;
      console.log(reorder);
      var trackUpdate = {
        title: work.title,
        category: work.category,
        date: work.date,
        instrumentation: work.instrumentation,
        info: work.info,
        link: work.link,
        audio: work.audio,
        video: work.video
      }
      if (!cachedWork) {
        var naturalPlacement;
        // If no track previously associated with the work, add a track and update the playlist
        console.log('you will be adding a track where one previously did not exist');
        console.log(work.audio);
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
            console.log(i);
            // Check that this loop catches the right playlist values/indexes when work is not naturally last.
            if (reorder[i] >= naturalPlacement) {
              console.log(reorder[i]);
              reorder[i] += 1;
            }
          }
          reorder.push(naturalPlacement);
          console.log(reorder);
          //oldOrder.push(news);
          updateWorksOrder(reorder);
        });
      } else {
        if (!work.audio) {
          var naturalPlacement;
          console.log('already a track, so its fine');
          console.log(work._id);
          console.log(fact.works);
          for (var i = 0, len = fact.works.length; i < len; i++) {
            if (fact.works[i].audio) {
              console.log(fact.works[i]._id);
              if (fact.works[i]._id === work._id) {
                naturalPlacement = count;
              }
              count++;
            }
          }
          console.log(naturalPlacement);
          $http.patch('/api/works/' + work._id, trackUpdate)
          .success(function() {
            for (var i = 0, len = reorder.length; i < len; i++) {
              console.log(i);
              // Check that this loop catches the right playlist values/indexes when work is not naturally last.
              if (reorder[i] >= naturalPlacement) {
                console.log(reorder[i]);
                reorder[i] += 1;
              }
            }
            reorder.push(naturalPlacement);
            updateWorksOrder(order);
          });
        } else {
          // Update the work
        }
        // Assign the natural position
        // Get index of natural position in playlist and splice
        // Update the playlist
        // Update the work track without updating the playlist
        /*$http.patch('/api/works/' + work._id, trackUpdate);*/
      }
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
    // Cache old work values
    function cacheWork(data) {
      cachedWork = data.audio;
      console.log('successfully cached a work');
      //return cachedWork;
    };
    // Unique work audio
    function uniqueUrl(value) {
      if (value) {
        var u = cleanUrl(value);
        for (var i = 0; i < $scope.player.tracks.length; i++) {
          if ($scope.player.tracks[i].permalink_url === u) {
            return false;
          }
        }
      }
      return true;
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
      updateWork: updateWork,
      deleteWork: deleteWork,
      cacheWork: cacheWork,
      uniqueUrl: uniqueUrl,
      // Playlist order functions
      getWorksOrder: getWorksOrder,
      updateWorksOrder: updateWorksOrder,
      updatePlayerOrder: updatePlayerOrder
    };
  }]);
