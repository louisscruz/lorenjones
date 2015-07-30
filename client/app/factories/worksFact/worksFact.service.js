'use strict';

angular.module('lorenjonesApp')
  .factory('works', function ($http, socket) {
    var fact = { works: [], tracks: []};

    $http.get('/api/default_tracks').success(function(track) {
      angular.copy(track, fact.defaultTrack);
      if (track !== null) {
        fact.tracks.push(track[0].link);
      }
    });

    $http.get('/api/works').success(function(works) {
      for (var i = 0; i < works.length; i++) {
        if (works[i].audio) {
          fact.tracks.push(works[i].audio);
        }
      }
      socket.syncUpdates('work', fact.works);
    });

    $http.get('/api/dbw_movements').success(function(movements) {
      for (var i = 0; i < movements.length; i++) {
        fact.tracks.push(movements[i].audio);
      }
    })
    return fact;
  });
