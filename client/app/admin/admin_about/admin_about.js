'use strict';

angular.module('louiscruzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_about', {
        url: '/admin/about',
        templateUrl: 'app/admin/admin_about/admin_about.html',
        controller: 'AdminAboutCtrl'
      });
  });