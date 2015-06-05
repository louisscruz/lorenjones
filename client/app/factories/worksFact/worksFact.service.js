'use strict';

angular.module('louiscruzApp')
  .factory('works', function ($http, socket) {
    var fact = { works: [], defaultTrack: []};

    $http.get('/api/works').success(function(works) {
      angular.copy(works, fact.works);
      socket.syncUpdates('work', fact.works);
    });
    $http.get('/api/default_tracks').success(function(track) {
      angular.copy(track, fact.defaultTrack);
    });
    return fact;
  });
