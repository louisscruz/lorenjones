'use strict';

angular.module('lorenjonesApp')
  .controller('EventsCtrl', function ($scope, $http, socket, eventsFact) {
    $scope.radioModel = 'Upcoming';
    $scope.events = [];
    $scope.options = {scrollwheel: false};
    $scope.dateOptions = {
      format: 'dddd, mmmm dddd',
    };
    $scope.dateFilter = function(obj) {
      var date = roundDate(new Date());
      var eventDate = roundDate(new Date(obj.date));
      return eventDate >= date;
    };
    $scope.sort = 'date';

    $http.get('/api/events', {cache: false}).success(function(events) {
      $scope.events = events;
      socket.syncUpdates('event', $scope.events);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('event');
    });

    $scope.pastEvents = function() {
      $scope.dateFilter = function(obj) {
        var date = eventsFact.roundDate(new Date());
        var eventDate = eventsFact.roundDate(new Date(obj.date));
        return eventDate < date;
      };
      $scope.sort = '-date';
    };

    $scope.upcomingEvents = function() {
      $scope.dateFilter = function(obj) {
        var date = eventFacts.roundDate(new Date());
        var eventDate = eventsFact.roundDate(new Date(obj.date));
        return eventDate >= date;
      };
      $scope.sort = 'date';
    };

  });
