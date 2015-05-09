'use strict';

angular.module('louiscruzApp')
  .factory('works', function ($http, socket) {
    var fact = { works: []};

    $http.get('/api/works').success(function(works) {
      angular.copy(works, fact.works);
      socket.syncUpdates('work', fact.works);
    });
    return fact;
  });
