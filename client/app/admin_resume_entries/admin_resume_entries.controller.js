'use strict';

angular.module('louiscruzApp')
  .controller('AdminResumeEntriesCtrl', function ($scope, $http, socket) {
    $scope.resumeCategories = [];
    $scope.resumeEntries = [];

    $http.get('/api/resume_categories').success(function(resumeCategories) {
      $scope.resumeCategories = resumeCategories;
      socket.syncUpdates('resume_category', $scope.resumeCategories);
    });

    $http.get('/api/resume_entries').success(function(resumeEntries) {
      $scope.resumeEntries = resumeEntries;
      socket.syncUpdates('resume_entry', $scope.resumeEntries);
    });

    $scope.addCategory = function() {
      if($scope.newCategory === '' ) {
        return;
      }
      $http.post('/api/resume_categories', {
        name: $scope.newCategory
      });
      $scope.newCategory = '';
    };

    $scope.deleteCategory = function(category) {
      $http.delete('/api/resume_categories/' + category._id);
    };

    $scope.$on('$destroy', function() {
      scope.unsynUpdates('category');
    });

    $scope.addEntry = function() {
      if($scope.newTitle === '' ) {
        return;
      }
      $http.post('/api/resume_entries', {
        title: $scope.newTitle,
        field1: $scope.newField1,
        field2: $scope.newField2,
        field3: $scope.newField3,
        field4: $scope.newField4,
        field5: $scope.newField5,
        category: $scope.newEntryCategory
      });
      $scope.newTitle = '';
      $scope.newField1 = '';
      $scope.newField2 = '';
      $scope.newField3 = '';
      $scope.newField4 = '';
      $scope.newField5 = '';
      $scope.newCategory = '';
    };

    $scope.deleteEntry = function(entry) {
      $http.delete('/api/resume_entries/' + entry._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('entry');
    });
  });
