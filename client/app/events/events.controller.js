'use strict';

angular.module('louiscruzApp')
  .controller('EventsCtrl', function ($scope) {
    $scope.events = {
      scheduled: [
      {
        "date": "20141121T17:00:00",
        "time": "5pm",
        "name": "Mirror Stage",
        "venue": "Rosemary and Meredith Wilson Theater",
        "city": "New York, New York",
        "center": [-73.984987, 40.772214],
        "zoom": 15,
        "draggable": true
      },

      {
        "date": "20141121T21:00:00",
        "time": "9pm",
        "name": "Mirror Stage",
        "venue": "Rosemary and Meredith Wilson Theater",
        "city": "New York, New York",
        "center": [-73.984987, 40.772214],
        "zoom": 15,
        "draggable": true
      },

      {
        "date": "20141122T14:00:00",
        "time": "2pm",
        "name": "Mirror Stage",
        "venue": "Rosemary and Meredith Wilson Theater",
        "city": "New York, New York",
        "center": [-73.984987, 40.772214],
        "zoom": 15,
        "draggable": true
      },

      {
        "date": "20141122T20:00:00",
        "time": "8pm",
        "name": "Mirror Stage",
        "venue": "Rosemary and Meredith Wilson Theater",
        "center": [-73.984987, 40.772214],
        "zoom": 15,
        "draggable": true
      }

      ]};
  });
