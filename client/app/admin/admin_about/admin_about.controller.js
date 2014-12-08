'use strict';

angular.module('louiscruzApp')
  .controller('AdminAboutCtrl', function ($scope, $http, socket) {
    $scope.bioEntries = [];
    $scope.resumeEntries = [];

    $http.get('/api/bio_entries').success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      socket.syncUpdates('bio_entry', $scope.bioEntries);
    });

    $http.get('/api/resume_entries').success(function(resumeEntries) {
      $scope.resumeEntries = resumeEntries;
      socket.syncUpdates('resume_entry', $scope.resumeEntries);
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

    $scope.addResumeEntry = function() {
      if($scope.newTitle === '' || $scope.newCategory === '') {
        return;
      }
      $http.post('/api/resume_entries', {
        title: $scope.newTitle,
        field1: $scope.newField1,
        field2: $scope.newField2,
        field3: $scope.newField3,
        field4: $scope.newField4,
        field5: $scope.newField5,
        category: $scope.newCategory
      });
      $scope.newTitle = '';
      $scope.newField1 = '';
      $scope.newField2 = '';
      $scope.newField3 = '';
      $scope.newField4 = '';
      $scope.newField5 = '';
      $scope.newCategory = '';
    };

    $scope.deleteResumeEntry = function(entry) {
      $http.delete('/api/resume_entries/' + entry._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('entry');
    });
  });
