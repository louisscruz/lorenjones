'use strict';

angular.module('louiscruzApp')
  .controller('EventsCtrl', function ($scope, $http, socket) {
    $scope.events = [];
    $scope.options = {scrollwheel: false};
    $scope.dateOptions = {
      format: 'dddd, mmmm dddd',
    };

    $http.get('/api/events', {cache: true}).success(function(events) {
      $scope.events = events;
      socket.syncUpdates('event', $scope.events);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('event');
    });

    $scope.pastEvents = function() {
      $scope.dateFilter = function(obj) {
        var date = new Date();
        var eventDate = new Date(obj.date);
        return eventDate < date;
      };
      $scope.sort = '-date';
    };

    $scope.upcomingEvents = function() {
      $scope.dateFilter = function(obj) {
        var date = new Date();
        var eventDate = new Date(obj.date);
        return eventDate >= date;
      };
      $scope.sort = 'date';
    };

  });
