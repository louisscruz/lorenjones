'use strict';

angular.module('lorenjonesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('birdseyeview', {
        url: '/birds-eye-view',
        templateUrl: 'app/birdseyeview/birdseyeview.html',
        controller: 'BirdseyeviewCtrl'
      });
  });