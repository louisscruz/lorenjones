'use strict';

angular.module('louiscruzApp')
  .controller('EventsCtrl', function ($scope, $http, socket) {
    $scope.events = [];
    $scope.options = {scrollwheel: false};
    $scope.dateOptions = {
      format: 'dddd, mmmm dddd',
    };

    $http.get('/api/events').success(function(events) {
      $scope.events = events;
      socket.syncUpdates('events', $scope.events);
    });
  });
