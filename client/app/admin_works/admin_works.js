'use strict';

angular.module('louiscruzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_works', {
        url: '/admin_works',
        templateUrl: 'app/admin_works/admin_works.html',
        controller: 'AdminWorksCtrl'
      });
  });