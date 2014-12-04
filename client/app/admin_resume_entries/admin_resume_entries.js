'use strict';

angular.module('louiscruzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_resume_entries', {
        url: '/admin_resume_entries',
        templateUrl: 'app/admin_resume_entries/admin_resume_entries.html',
        controller: 'AdminResumeEntriesCtrl'
      });
  });