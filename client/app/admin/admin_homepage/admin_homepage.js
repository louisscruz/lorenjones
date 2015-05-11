'use strict';

angular.module('louiscruzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_homepage', {
        url: '/admin/homepage',
        templateUrl: 'app/admin/admin_homepage/admin_homepage.html',
        controller: 'AdminHomepageCtrl'
      });
  });