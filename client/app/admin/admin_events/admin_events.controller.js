'use strict';

angular.module('louiscruzApp')
  .controller('AdminEventsCtrl', function ($scope, $http, socket) {
    $scope.events = [];

    $http.get('/api/events').success(function(events) {
      $scope.events = events;
      socket.syncUpdates('event', $scope.events);
    });

    $scope.addEvent = function() {
      if($scope.newName === '' ) {
        return;
      }
      $http.post('/api/events', {
        name: $scope.newName,
        date: $scope.newDate,
        time: $scope.newTime,
        venue: $scope.newVenue,
        city: $scope.newCity,
        center: $scope.newCenter,
        lat: $scope.newLat,
        lng: $scope.newLng
      });
      //$scope.newDate = '';
      //$scope.newTime = '';
      //$scope.newName = '':
      //$scope.newVenue = '';
      //$scope.newCity = '';
      //$scope.newCenter = '';
    };

    $scope.deleteEvent = function(event) {
      $http.delete('/api/events/' + event._id);
    };
  });
