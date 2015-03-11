'use strict';

angular.module('louiscruzApp')
  .controller('AboutCtrl', function ($scope, $http, socket) {
    $scope.bioEntries = [];

    $http.get('/api/bio_entries').success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      socket.syncUpdates('bio_entry', $scope.bioEntries);
    });
  });
