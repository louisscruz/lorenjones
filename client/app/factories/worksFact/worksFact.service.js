'use strict';

angular.module('lorenjonesApp')
  .factory('works', function ($http, socket) {
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
    });

    // Delete the default track
    fact.deleteDefaultTrack = function() {
      return $http.get('/api/default_tracks').success(function(tracks) {
        var d = tracks[0];
        $http.delete('/api/default_tracks/' + d._id);
        fact.defaultTrack = false;
      });
    };

    // Update the default track
    fact.updateDefaultTrack = function(track) {
      return $http.patch('/api/default_tracks/' + fact.defaultTrack[0]._id, track).success(function(data) {
        //fact.defaultTrack.push(data);
        //fact.tracks.push(data);
      });
    };

    // Sort the track order if /api/playlist returns a valuable
    $http.get('/api/playlists').success(function(playlist) {
      //
    });
    return fact;
  });
