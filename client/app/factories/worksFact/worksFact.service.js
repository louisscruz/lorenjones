'use strict';
/*jshint shadow: true*/
angular.module('lorenjonesApp')
  .factory('works', ['$http', '$rootScope', 'socket', 'soundcloud', 'cleanUrl', '$q', function ($http, $rootScope, socket, soundcloud, cleanUrl, $q) {
    var fact = { defaultTrack: [], works: [], dbwMovements: [], sweetTommyTracks: [], worksOrder: [], worksTracks: [], cachedWork: {} };
    // Get all works and tracks; send tracks to soundcloud player
    function loadAll() {
      soundcloud.dumpData();
      var deferred = $q.defer();
      var defaultTrackUrl = $http.get('/api/default_tracks');
      var worksUrl = $http.get('/api/works');
      var dbwMovementsUrl = $http.get('/api/dbw_movements');
      var sweetTommyTracksUrl = $http.get('/api/sweet_tommy_tracks');
      var worksOrderUrl = $http.get('/api/playlists');
      $q.all([defaultTrackUrl, worksUrl, dbwMovementsUrl, sweetTommyTracksUrl, worksOrderUrl]).then(function(assets) {
        var index = 0;
        // Load all assets into fact
        angular.copy(assets[0].data, fact.defaultTrack);
        angular.copy(assets[1].data, fact.works);
        angular.copy(assets[2].data, fact.dbwMovements);
        angular.copy(assets[3].data, fact.sweetTommyTracks);
        angular.copy(assets[4].data.order, fact.worksOrder);
        // Load default track to player
        if (fact.defaultTrack[0]) {
          soundcloud.loadPlayerWith(fact.defaultTrack[0].link, index);
          index++;
        }
        // Load works to fact.worksTracks
        for (var i = 0; i < fact.works.length; i++) {
          if (fact.works[i].audio) {
            fact.worksTracks.push(fact.works[i].audio);
          }
        }
        // Load worksTracks to player
        for (var i = 0; i < fact.worksOrder.length; i++) {
          soundcloud.loadPlayerWith(fact.worksTracks[fact.worksOrder[i]], index);
          index++;
        }
        // Load dbwMovements to player
        for (var i = 0; i < fact.dbwMovements.length; i++) {
          if (fact.dbwMovements[i].audio) {
            soundcloud.loadPlayerWith(fact.dbwMovements[i].audio, index);
            index++;
          }
        }
        // Load Sweet Tommy Tracks to player
        console.log(fact.sweetTommyTracks);
        for (var i = 0; i < fact.sweetTommyTracks.length; i++) {
          if (fact.sweetTommyTracks[i].url) {
            soundcloud.loadPlayerWith(fact.sweetTommyTracks[i].url, index);
            index++;
          }
        }
      });
      deferred.resolve(fact);
      return deferred.promise;
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
        if (work.audio || work.audio === '') {
          console.log(fact.worksOrder);
          var newOrder;
          if (!fact.worksOrder) {
            newOrder = [0];
          } else {
            var length = fact.worksOrder.length;
            newOrder = fact.worksOrder;
            newOrder.push(length);
          }
          console.log(newOrder);
          updateWorksOrder(newOrder).success(function() {
            loadAll();
          });
        }
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
      if (!fact.cachedWork.audio) {
        $http.patch('/api/works/' + work._id, trackUpdate).success(function() {
          for (var i = 0; i < fact.works.length; i++) {
            if (fact.works[i]._id === work._id) {
              fact.works[i] = work;
              break;
            }
          }
          // If the work did not originally have a track, and the update does
          if (work.audio) {
            for (var i = 0, len = fact.works.length; i < len; i++) {
              if (fact.works[i].audio) {
                if (fact.works[i].audio === work.audio) {
                  console.log(naturalPlacement);
                  naturalPlacement = count;
                  console.log(naturalPlacement);
                  break;
                }
                count++;
              }
            }
            for (var i = 0, len = reorder.length; i < len; i++) {
              // Check that this loop catches the right playlist values/indexes when work is not naturally last.
              if (reorder[i] >= naturalPlacement) {
                reorder[i] += 1;
              }
            }
            console.log('there was not audio, but now there is');
            updateWorksOrder(reorder);
          }
        })
        .then(function() {
          loadAll();
        });
      } else {
        if (!work.audio) {
          /*for (var y = 0, len = fact.works.length; y < len; y++) {
            if (fact.works[y]._id === work._id) {
              naturalPlacement = count;
              console.log(natrualPlacement);
              break;
            }
            count++;
          }*/
          var naturalPosition = fact.worksTracks.indexOf(work.audio);
          console.log(naturalPosition);
          $http.patch('/api/works/' + work._id, trackUpdate).success(function() {
            reorder.splice(reorder.indexOf(naturalPlacement), 1);
            for (var i = 0, len = reorder.length; i < len; i++) {
              // Check that this loop catches the right playlist values/indexes when work is not naturally last.
              if (reorder[i] > naturalPlacement) {
                reorder[i] -= 1;
              }
            }
            fact.worksTracks.splice(fact.cachedWork, 1);
            //fact.worksOrder.splice(reorder.indexOf(naturalPlacement), 1);
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
        fact.works.splice(fact.works.indexOf(work), 1);
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
          updateWorksOrder(order).success(function() {
            fact.worksTracks.splice(naturalPosition, 1);
            loadAll();
          });
        }
      });
    }
    // Cache old work values
    function cacheWork(data) {
      if (data === fact.cachedWork) {
        fact.cachedWork = null;
      } else {
        fact.cachedWork = angular.copy(data, fact.cachedWork);
      }
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
        angular.copy(data.order, fact.worksOrder);
      });
    }
    // Update the playlist order
    function updateWorksOrder(o) {
      return $http.patch('/api/playlists', {order: o}).success(function(data) {
        console.log(data);
        fact.worksOrder = o;
      });
    }
    return {
      loadAll: loadAll,
      // Resources
      works: fact.works,
      dbwMovements: fact.dbwMovements,
      sweetTommyTracks: fact.sweetTommyTracks,
      defaultTrack: fact.defaultTrack,
      worksTracks: fact.worksTracks,
      worksOrder: fact.worksOrder,
      cachedWork: fact.cachedWork,
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
