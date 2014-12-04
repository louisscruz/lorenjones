'use strict';

angular.module('louiscruzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_bio_entries', {
        url: '/admin_bio_entries',
        templateUrl: 'app/admin_bio_entries/admin_bio_entries.html',
        controller: 'AdminBioEntriesCtrl'
      });
  });