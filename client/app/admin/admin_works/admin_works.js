'use strict';

angular.module('louiscruzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_works', {
        url: '/admin/works',
        templateUrl: 'app/admin/admin_works/admin_works.html',
        controller: 'AdminWorksCtrl'
      });
  });