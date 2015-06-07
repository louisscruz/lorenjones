'use strict';

angular.module('lorenjonesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dbw', {
        url: '/dbw',
        templateUrl: 'app/dbw/dbw.html',
        controller: 'DbwCtrl'
      });
  });
