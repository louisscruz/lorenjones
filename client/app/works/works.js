'use strict';

angular.module('louiscruzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('works', {
        url: '/works',
        templateUrl: 'app/works/works.html',
        controller: 'WorksCtrl'
      });
  });