'use strict';

angular.module('louiscruzApp')
  .controller('AdminBioEntriesCtrl', function ($scope, $http, socket) {
    $scope.bioEntries = [];

    $http.get('/api/bio_entries').success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      socket.syncUpdates('bio_entry', $scope.bioEntries);
    });

    $scope.addEntry = function() {
      if($scope.newTitle === '' || $scope.newContent === '' ) {
        return;
      }
      $http.post('/api/bio_entries', {
        title: $scope.newTitle,
        content: $scope.newContent
        });
      $scope.newTitle = '';
      $scope.newContent = '';
    };

    $scope.deleteEntry = function(entry) {
      $http.delete('/api/bio_entries/' + entry._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('entry');
    });
  });
