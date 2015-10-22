'use strict';

angular.module('lorenjonesApp')
  .controller('EventsCtrl', function ($scope, $http, socket, eventsFact) {
    $scope.upcomingEvents = [];
    $scope.pastEvents = [];
    $scope.eventSelector = 'Upcoming';
    $scope.options = {scrollwheel: false};
    $scope.dateOptions = {
      format: 'dddd, mmmm dddd',
    };
    $scope.dateFilter = function(obj) {
      var date = eventsFact.roundDate(new Date());
      var eventDate = eventsFact.roundDate(new Date(obj.date));
      return eventDate >= date;
    };
    $scope.sort = 'datetime';
    $http.get('/api/events', {cache: false}).success(function(events) {
      var currentDate = new Date();
      for (var i = 0; i < events.length; i++) {
        if (new Date(events[i].datetime) < currentDate) {
          $scope.pastEvents.push(events[i]);
        } else {
          $scope.upcomingEvents.push(events[i]);
        }
      }
      if ($scope.upcomingEvents.length === 0) {
        $scope.eventSelector = 'Past';
        $scope.eventDataset($scope.eventSelector);
      }
      socket.syncUpdates('event', $scope.events);
    });
    $scope.eventDataset = function(selector) {
      var events = [];
      if (selector === 'Upcoming') {
        $scope.sort = 'datetime';
        events = $scope.upcomingEvents;
      } else {
        $scope.sort = '-datetime';
        events = $scope.pastEvents;
      }
      return events;
    };
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('event');
    });
  });
