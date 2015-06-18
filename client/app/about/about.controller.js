'use strict';

angular.module('lorenjonesApp')
  .controller('AboutCtrl', function ($scope, $http, socket, $interval, instagram, flickr) {
    $scope.bioEntries = [];

    $http.get('/api/bio_entries', {cache: true}).success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      socket.syncUpdates('bio_entry', $scope.bioEntries);
    });

    $scope.getMore = function() {
      flickr.fetchPopular(function(data) {
          for(var i=0; i<data.length; i++) {
            if (typeof $scope.have[data[i].id]==="undefined") {
              $scope.pics.push(data[i]) ;
              $scope.have[data[i].id] = "1";
            }
          }
      });
    };
    $scope.pics = [];
    $scope.src = "photos_public.gne?id=92505062@N04";
    $scope.loadPhotos = function() {
      flickr.query($scope.src)
      .then(function(data) {
        for(var i=0; i<data.length; i++) {
          $scope.pics.push(data[i]);
        }
      })
    };
    $scope.loadPhotos();

  });
