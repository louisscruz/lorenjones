'use strict';

angular.module('louiscruzApp')
  .controller('AdminAboutCtrl', function ($scope, $http, socket) {
    $scope.bioEntries = [];

    $http.get('/api/bio_entries', {cache: true}).success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      socket.syncUpdates('bio_entry', $scope.bioEntries);
    });

    $scope.addBioEntry = function() {
      if($scope.newTab === '' || $scope.newContent === '' ) {
        return;
      }
      $http.post('/api/bio_entries', {
        title: $scope.newTab,
        content: $scope.newContent
      });
      $scope.newTab = '';
      $scope.newContent = '';
    };

    $scope.deleteBioEntry = function(entry) {
      $http.delete('/api/bio_entries/' + entry._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('bio_entry');
    });
  });
