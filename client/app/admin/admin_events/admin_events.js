'use strict';

angular.module('louiscruzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_events', {
        url: '/admin/events',
        templateUrl: 'app/admin/admin_events/admin_events.html',
        controller: 'AdminEventsCtrl'
      });
  });