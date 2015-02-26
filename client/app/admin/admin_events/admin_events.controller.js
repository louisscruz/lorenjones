'use strict';

angular.module('louiscruzApp')
  .controller('AdminEventsCtrl', function ($scope, $http, socket) {
    $scope.events = [];
    $scope.options = {scrollwheel: false};
    $scope.dateOptions = {
      format: 'ddd, dd-mm-yyyy',
    };

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
        link: $scope.newLink,
        info: $scope.newInfo,
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
      //$scope.newLat = '';
      //$scope.newLng = '';
    };

    $scope.deleteEvent = function(event) {
      $http.delete('/api/events/' + event._id);
    };
  });
