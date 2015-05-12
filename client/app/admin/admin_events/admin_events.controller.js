'use strict';

angular.module('louiscruzApp')
  .controller('AdminEventsCtrl', function ($scope, $http, socket) {
    $scope.events = [];
    $scope.options = {scrollwheel: false};
    $scope.levels = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ];
    $scope.dateOptions = {
      format: 'ddd, dd-mm-yyyy',
    };

    $http.get('/api/events', {cache: true}).success(function(events) {
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
        lat: $scope.newLat,
        lng: $scope.newLng,
        zoom: $scope.newZoom
      });
      $scope.newName = '';
      $scope.newDate = '';
      $scope.newTime = '';
      $scope.newVenue = '';
      $scope.newCity = '';
      $scope.newLink = '';
      $scope.newInfo = '';
      $scope.newLat = '';
      $scope.newLng = '';
      $scope.newZoom = '';
    };

    $scope.updateEvent = function(event) {
      return $http.put('/api/events/' + event._id, {
        name: event.name,
        date: event.date,
        time: event.time,
        venue: event.venue,
        city: event.city,
        link: event.link,
        info: event.info,
        lat: event.lat,
        lng: event.lng,
        zoom: event.zoom
      });
    };

    $scope.deleteEvent = function(event) {
      $http.delete('/api/events/' + event._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('event');
    });
  });
