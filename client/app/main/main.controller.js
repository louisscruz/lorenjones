'use strict';

angular.module('louiscruzApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    //var BV = new $.BigVideo();
    //BV.init();
    //BV.show('http://vjs.zencdn.net/v/oceans.mp4',{container:$('#video'), ambient:true, doloop:true});

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $http.get('/api/events').success(function(events) {
      $scope.events = events;
      socket.syncUpdates('events', $scope.events);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
