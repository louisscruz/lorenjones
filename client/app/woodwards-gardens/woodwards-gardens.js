'use strict';

angular.module('lorenjonesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('woodwards-garden', {
        url: '/woodwards-gardens',
        templateUrl: 'app/woodwards-gardens/woodwards-gardens.html',
        controller: 'WoodwardsGardensCtrl'
      });
  });
