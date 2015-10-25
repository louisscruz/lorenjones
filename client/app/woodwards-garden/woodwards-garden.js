'use strict';

angular.module('lorenjonesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('woodwards-garden', {
        url: '/woodwards-garden',
        templateUrl: 'app/woodwards-garden/woodwards-garden.html',
        controller: 'WoodwardsGardenCtrl'
      });
  });