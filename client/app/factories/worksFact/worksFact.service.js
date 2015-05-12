'use strict';

angular.module('louiscruzApp')
  .factory('works', function ($http, socket) {
    var fact = { works: []};

    $http.get('/api/works', {cache: true}).success(function(works) {
      angular.copy(works, fact.works);
      socket.syncUpdates('work', fact.works);
    });
    return fact;
  });
