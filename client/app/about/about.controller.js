'use strict';

angular.module('lorenjonesApp')
  .controller('AboutCtrl', function ($scope, $http, socket, $interval, instagram, flickr, Lightbox) {
    $scope.bioEntries = [];

    $http.get('/api/bio_entries', {cache: true}).success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      socket.syncUpdates('bio_entry', $scope.bioEntries);
    });

    $scope.pics = [];
    $scope.src = "photos_public.gne?id=134139109@N08";
    $scope.loadPhotos = function() {
      flickr.query($scope.src)
      .then(function(data) {
        for(var i=0; i<data.length; i++) {
          $scope.pics.push(data[i]);
        }
      })
    };
    $scope.loadPhotos();
    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.pics, index);
    };

  });
