'use strict';

angular.module('lorenjonesApp')
  .factory('works', function ($http, socket) {
    var fact = { works: [], tracks: [], dbwMovements: [], defaultTrack: false};

    $http.get('/api/default_tracks').success(function(track) {
      angular.copy(track.link, fact.tracks);
      if (track !== null) {
        fact.defaultTrack = true;
        fact.tracks.push(track[0].link);
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

    // Sort the track order if /api/playlist returns a valuable
    $http.get('/api/playlists').success(function(playlist) {
      //
    });
    return fact;
  });
