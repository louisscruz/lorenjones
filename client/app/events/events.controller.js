'use strict';

angular.module('lorenjonesApp')
  .controller('EventsCtrl', function ($scope, $http, socket) {
    $scope.radioModel = 'Upcoming';
    $scope.events = [];
    $scope.options = {scrollwheel: false};
    $scope.dateOptions = {
      format: 'dddd, mmmm dddd',
    };
    function roundDate(timeStamp){
        timeStamp -= timeStamp % (24 * 60 * 60 * 1000);//subtract amount of time since midnight
        timeStamp += new Date().getTimezoneOffset() * 60 * 1000;//add on the timezone offset
        return new Date(timeStamp);
    }
    $scope.dateFilter = function(obj) {
      var date = roundDate(new Date());
      var eventDate = roundDate(new Date(obj.date));
      return eventDate >= date;
    };
    $scope.sort = 'date';

    $http.get('/api/events', {cache: true}).success(function(events) {
      $scope.events = events;
      socket.syncUpdates('event', $scope.events);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('event');
    });

    $scope.pastEvents = function() {
      $scope.dateFilter = function(obj) {
        var date = roundDate(new Date());
        var eventDate = roundDate(new Date(obj.date));
        return eventDate < date;
      };
      $scope.sort = '-date';
    };

    $scope.upcomingEvents = function() {
      $scope.dateFilter = function(obj) {
        var date = roundDate(new Date());
        var eventDate = roundDate(new Date(obj.date));
        return eventDate >= date;
      };
      $scope.sort = 'date';
    };

  });
