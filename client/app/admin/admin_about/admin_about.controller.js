'use strict';

angular.module('lorenjonesApp')
  .controller('AdminAboutCtrl', function ($scope, $http, socket, Modal) {
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

    $scope.updateBioEntry = function(entry) {
      return $http.put('/api/bio_entries/' + entry._id, {
        title: entry.title,
        content: entry.content
      });
    };

    $scope.deleteEntry = function(id) {
      $http.delete('/api/bio_entries/' + id);
    };

    $scope.confirmDelete = Modal.confirm.delete(function(entry) {
      $scope.deleteEntry(entry._id);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('bio_entry');
    });
  });
