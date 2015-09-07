'use strict';

angular.module('lorenjonesApp')
  .controller('AdminEventsCtrl', function ($scope, $http, socket, Modal, uiGmapGoogleMapApi) {
    $scope.events = [];
    $scope.loadMap = function() {
      if ($scope.newAddress && $scope.newCity) {
        $scope.loadingMap = true;
        console.log('both are filled');
        uiGmapGoogleMapApi.then(function(maps) {
          console.log('activating api');
          var geocoder = new maps.Geocoder();
          geocoder.geocode({'address': $scope.newAddress + ',' + $scope.newCity}, function(results, status) {
            if (!results[0]) { return; }
            var newLat = results[0].geometry.location.G;
            var newLng = results[0].geometry.location.K;
            $scope.newMap = { latitude: newLat, longitude: newLng }
          });
          $scope.newZoom = 15;
          $scope.loadingMap = false;
        }, function() {
          console.log('Server error');
        });
      }
    };
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    $scope.options = {scrollwheel: false};
    $scope.isDateCollapsed = true;
    $scope.toggleCollapseDate = function() {
      $scope.isDateCollapsed = !$scope.isDateCollapsed;
    };
    $scope.closeDate = function() {
      if (!$scope.isDateCollapsed) {
        $scope.toggleCollapseDate();
      }
    };
    $scope.levels = [];
    for (var i = 1; i < 20; i++) {
      $scope.levels.push(i);
    }
    $scope.dateOptions = {
      format: 'ddd, dd-mm-yyyy',
    };

    $http.get('/api/events', {cache: true}).success(function(events) {
      $scope.events = events;
      socket.syncUpdates('event', $scope.events);
    });

    $scope.addEvent = function(isValid) {
      if (isValid) {
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
      }
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

    $scope.deleteEvent = function(id) {
      $http.delete('/api/events/' + id);
    };

    $scope.confirmDelete = Modal.confirm.delete(function(event) {
      $scope.deleteEvent(event._id);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('event');
    });
  });
