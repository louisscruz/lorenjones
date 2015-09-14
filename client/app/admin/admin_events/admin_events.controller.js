'use strict';

angular.module('lorenjonesApp')
  .controller('AdminEventsCtrl', function ($scope, $http, socket, Modal, uiGmapGoogleMapApi, $compile, eventsFact) {
    $scope.events = [];
    $scope.newZoom;
    $scope.eventSelector = 'Upcoming';
    $scope.editing = false;
    $scope.copiedEvent;
    $scope.pastEvents = [];
    $scope.upcomingEvents = [];
    $http.get('/api/events', {cache: false}).success(function(events) {
      var currentDate = new Date();
      for (var i = 0; i < events.length; i++) {
        if (new Date(events[i].datetime) < currentDate) {
          $scope.pastEvents.push(events[i]);
        } else {
          $scope.upcomingEvents.push(events[i]);
        }
      }
      if ($scope.eventSelector === 'Upcoming') {
        $scope.events = $scope.upcomingEvents;
      } else {
        $scope.events = $scope.pastEvents;
      }
      socket.syncUpdates('event', $scope.events);
    });
    $scope.$watch('eventSelector', function() {
      if ($scope.eventSelector === 'Upcoming') {
        $scope.events = $scope.upcomingEvents;
      } else {
        $scope.events = $scope.pastEvents;
      }
      $scope.editing = false;
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
        eventsFact.getCoords($scope.newAddress, $scope.newCity).then(function(result) {
          $scope.newLat = result[0];
          $scope.newLng = result[1];
        }).then(function() {
          $scope.newZoom = 15;
          $scope.loadingMap = false;
        });
      }
    };
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
          lat: $scope.newLat,
          lng: $scope.newLng,
          city: $scope.newCity,
          link: $scope.newLink,
          info: $scope.newInfo,
          zoom: $scope.newZoom
        }).then(function() {
          $scope.resetForm();
        });
      }
    };
    $scope.updateEvent = function(event) {
      $scope.editing = false;
      console.log('updating');
      if ($scope.eventSelector === 'Upcoming') {
        console.log('event selector is upcoming');
        for (var i = 0; i < $scope.upcomingEvents.length; i++) {
          if ($scope.upcomingEvents[i]._id === event._id) {
            $scope.upcomingEvents[i] = event;
            break;
          }
        }
        $scope.events = $scope.upcomingEvents;
      } else {
        for (var i = 0; i < $scope.pastEvents.length; i++) {
          if ($scope.pastEvents[i]._id === event._id) {
            console.log(event);
            $scope.pastEvents[i] = event;
            break;
          }
        }
        $scope.events = $scope.pastEvents;
      }
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
    $scope.toggleEdit = function(index, item) {
      if ($scope.editing === index) {
        $scope.editing = false;
        $scope.copiedEvent = null;
      } else {
        $scope.editing = index;
        $scope.copiedEvent = angular.copy(item);
      }
    };
    $scope.updateCopiedCoords = function() {
      if ($scope.copiedEvent.address && $scope.copiedEvent.city) {
        eventsFact.getCoords($scope.copiedEvent.address, $scope.copiedEvent.city).then(function(result) {
          $scope.copiedEvent.lat = result[0];
          $scope.copiedEvent.lng = result[1];
        }).then(function() {
          $scope.copiedEvent.zoom = 15;
        });
      } else {
        $scope.copiedEvent.lat = '';
        $scope.copiedEvent.lng = '';
      }
    };
    $scope.confirmDelete = Modal.confirm.delete(function(event) {
      $scope.deleteEvent(event._id);
    });
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('event');
    });
  });
