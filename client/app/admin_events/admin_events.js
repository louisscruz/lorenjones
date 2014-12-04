'use strict';

angular.module('louiscruzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_events', {
        url: '/admin_events',
        templateUrl: 'app/admin_events/admin_events.html',
        controller: 'AdminEventsCtrl'
      });
  });