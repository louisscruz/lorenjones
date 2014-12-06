'use strict';

angular.module('louiscruzApp')
  .controller('AboutCtrl', function ($scope, $http, socket) {
    $scope.bioEntries = [];

    $http.get('/api/bio_entries').success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      socket.syncUpdates('entry', $scope.bioEntries);
    });

    $http.get('/api/resume_categories').success(function(resumeCategories) {
      $scope.resumeCategories = resumeCategories;
      socket.syncUpdates('category', $scope.resumeCategories);
    });

    $http.get('/api/resume_entries').success(function(resumeEntries) {
      $scope.resumeEntries = resumeEntries;
      socket.syncUpdates('entry', $scope.resumeEntries);
    });
  });
