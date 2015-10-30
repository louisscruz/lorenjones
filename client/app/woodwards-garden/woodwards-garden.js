'use strict';

angular.module('lorenjonesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('woodwards-garden', {
        url: '/woodwards-gardens',
        templateUrl: 'app/woodwards-garden/woodwards-garden.html',
        controller: 'WoodwardsGardenCtrl'
      });
  });
