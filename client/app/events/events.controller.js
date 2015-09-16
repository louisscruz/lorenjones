'use strict';

angular.module('lorenjonesApp')
  .controller('EventsCtrl', function ($scope, $http, socket, eventsFact) {
    $scope.eventSelector = 'Upcoming';
    $scope.upcomingEvents = [];
    $scope.pastEvents = [];
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
      var currentDate = new Date();
      console.log(events);
      for (var i = 0; i < events.length; i++) {
        console.log(i);
        if (new Date(events[i].datetime) < currentDate) {
          console.log($scope.pastEvents);
          $scope.pastEvents.push(events[i]);
        } else {
          $scope.upcomingEvents.push(events[i]);
        }
      }
      socket.syncUpdates('event', $scope.events);
    });
    $scope.eventDataset = function(selector) {
      if (selector === 'Upcoming') {
        $scope.sort = 'datetime';
        return $scope.upcomingEvents;
      } else {
        $scope.sort = '-datetime';
        return $scope.pastEvents;
      }
    };
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('event');
    });

    /*$scope.pastEvents = function() {
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
    };*/

  });
