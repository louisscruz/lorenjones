'use strict';

angular.module('lorenjonesApp')
  .controller('AdminEventsCtrl', function ($scope, $http, socket, Modal, uiGmapGoogleMapApi, $compile) {
    $scope.events = [];
    $scope.eventSelector = 'Upcoming';
    var upcomingEvents = [];
    var pastEvents = [];
    //$scope.eventSelector = 'Upcoming';
    $http.get('/api/events', {cache: true}).success(function(events) {
      var currentDate = new Date();
      for (var i = 0; i < events.length; i++) {
        if (new Date(events[i].datetime) < currentDate) {
          pastEvents.push(events[i]);
        } else {
          upcomingEvents.push(events[i]);
        }
      }
      if ($scope.eventSelector === 'Upcoming') {
        $scope.events = angular.copy(upcomingEvents);
      } else {
        $scope.events = angular.copy(pastEvents);
      }
      socket.syncUpdates('event', $scope.events);
    });
    $scope.$watch('eventSelector', function() {
      if ($scope.eventSelector === 'Upcoming') {
        $scope.events = angular.copy(upcomingEvents);
      } else {
        $scope.events = angular.copy(pastEvents);
      }
    });
    $scope.levels = [];
    var newLat;
    var newLng;
    for (var i = 1; i < 20; i++) {
      $scope.levels.push(i);
    }
    $scope.loadMap = function() {
      if ($scope.newAddress && $scope.newCity) {
        $scope.loadingMap = true;
        console.log('both are filled');
        uiGmapGoogleMapApi.then(function(maps) {
          console.log('activating api');
          var geocoder = new maps.Geocoder();
          geocoder.geocode({'address': $scope.newAddress + ',' + $scope.newCity}, function(results, status) {
            if (!results[0]) { return; }
            console.log(results);
            newLat = results[0].geometry.location.G;
            newLng = results[0].geometry.location.K;
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
    $scope.isEditDateCollapsed = true;
    $scope.toggleCollapseDate = function() {
      $scope.isDateCollapsed = !$scope.isDateCollapsed;
    };
    $scope.toggleEditCollapseDate = function() {
      $scope.isEditDateCollapsed = !$scope.isEditDateCollapsed;
    }
    $scope.closeDate = function() {
      if ($scope.isDateCollapsed === false) {
        $scope.toggleCollapseDate();
      }
    };
    $scope.closeEditDate = function() {
      if ($scope.isEditDateCollapsed !== true) {
        $scope.isEditDateCollapsed = true;
      }
    }
    $scope.dateFormat = /^(0[1-9]|1[0-2]|[1-9])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[0-9])\/(\d{2,4})\s(0[0-9]|1[0-2]|[1-9]):([0-5])([0-9])(?:am|pm)$/;
    $scope.addEvent = function(isValid) {
      if (isValid) {
        $http.post('/api/events', {
          title: $scope.newTitle,
          datetime: $scope.newDate,
          venue: $scope.newVenue,
          address: $scope.newAddress,
          lat: newLat,
          lng: newLng,
          city: $scope.newCity,
          link: $scope.newLink,
          info: $scope.newInfo,
          zoom: $scope.newZoom
        });
        $scope.resetForm();
      }
    };
    $scope.updateEvent = function(event) {
      $scope.editing = false;
      return $http.put('/api/events/' + event._id, {
        title: event.title,
        datetime: event.datetime,
        venue: event.venue,
        address: event.address,
        lat: event.lat,
        lng: event.lng,
        city: event.city,
        link: event.link,
        info: event.info,
        zoom: event.zoom
      });
    };
    $scope.updateCoords = function(event) {
      uiGmapGoogleMapApi.then(function(maps) {
        var geocoder = new maps.Geocoder();
        geocoder.geocode({'address': event.address + ',' + event.city}, function(results, status) {
          if (!results[0]) { return; }
          event.lat = results[0].geometry.location.G;
          event.lng = results[0].geometry.location.K;
          $scope.newMap = { latitude: newLat, longitude: newLng }
        });
        $scope.newZoom = 15;
        $scope.loadingMap = false;
      }, function() {
        console.log('Server error');
      });
    };
    $scope.deleteEvent = function(id) {
      $http.delete('/api/events/' + id);
    };
    $scope.resetForm = function() {
      $scope.newTitle = '';
      $scope.newDate = '';
      $scope.newVenue = '';
      $scope.newAddress = '';
      newLat = '';
      newLng = '';
      $scope.newCity = '';
      $scope.newLink = '';
      $scope.newInfo = '';
      $scope.newZoom = '';
      $scope.eventForm.$setPristine();
      $scope.eventForm.$setUntouched();
    };
    $scope.editing = false;
    $scope.copiedEvent;
    $scope.toggleEdit = function(index, item) {
      if ($scope.editing === index) {
        $scope.editing = false;
        $scope.copiedEvent = null;
      } else {
        $scope.editing = index;
        $scope.copiedEvent = angular.copy(item);
      }
    }
    $scope.copiedEvent;
    $scope.confirmDelete = Modal.confirm.delete(function(event) {
      $scope.deleteEvent(event._id);
    });
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('event');
    });
  });
