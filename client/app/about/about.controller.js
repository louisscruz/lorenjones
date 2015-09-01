'use strict';

angular.module('lorenjonesApp')
  .controller('AboutCtrl', function ($scope, $http, socket, $interval, flickr, Lightbox) {
    $scope.bioEntries = [];
    $http.get('/api/bio_entries', {cache: true}).success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      socket.syncUpdates('bio_entry', $scope.bioEntries);
    });
    $scope.pics = [];
    var perPage = 12;
    $scope.page = 1;
    $scope.endOfAlbum = false;
    $scope.loadingPhotos = false;
    var src = 'flickr.photosets.getPhotos';
    $scope.loadPhotos = function(page) {
      $scope.loadingPhotos = true;
      flickr.query(src, perPage, page)
      .then(function(data) {
        $scope.loadingPhotos = false;
        console.log(data);
        if (data.length < perPage) {
          $scope.endOfAlbum = true;
        }
        for (var i = 0, len = data.length; i < len; i++) {
          $scope.pics.push(data[i]);
        }
      });
    };
    $scope.loadPhotos($scope.page);
    $scope.loadMore = function() {
      $scope.page++;
      console.log($scope.page);
      console.log(perPage);
      $scope.loadPhotos($scope.page);
      console.log($scope.pics);
    };
    $scope.openLightboxModal = function(index) {
      Lightbox.openModal($scope.pics, index);
    };
  });
