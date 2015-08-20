'use strict';

angular.module('lorenjonesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sweet-tommy', {
        url: '/sweet-tommy',
        templateUrl: 'app/sweet-tommy/sweet-tommy.html',
        controller: 'SweetTommyCtrl'
      });
  });