'use strict';

angular.module('louiscruzApp')
  .controller('AdminEventsCtrl', function ($scope, $http, socket) {
    $scope.events = [];

    $http.get('/api/events').success(function(events) {
      $scope.events = events;
      socket.syncUpdates('event', $scope.events);
    });

    $scope.addEvent = function() {
      if($scope.newName === '' || $scope.dt === '' ) {
        return;
      }
      $http.post('/api/events', {
        date: $scope.dt,
        time: $scope.newTime,
        name: $scope.newName,
        venue: $scope.newVenue,
        city: $scope.newCity,
        center: $scope.newCenter,
      });
      $scope.dt = '';
      $scope.newTime = '';
      $scope.newName = '':
      $scope.newVenue = '';
      $scope.newCity = '';
      $scope.newCenter = '';
    };

    $scope.deleteEvent = function(event) {
      $http.delete('/api/bio_entries/' + entry._id);
    };

    $scope.codeAddress = function (address) {
      geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.map.control.getGMap().setCenter(results[0].geometry.location);
          $scope.map.marker.latitude = results[0].geometry.location.lat();
          $scope.map.marker.longitude = results[0].geometry.location.lng();
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
      return;
    };

  });
