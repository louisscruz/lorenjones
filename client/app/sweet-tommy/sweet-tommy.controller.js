'use strict';

angular.module('lorenjonesApp')
  .controller('SweetTommyCtrl', function ($scope, $interval, flickr, Lightbox) {
    $scope.pics = [];
    var photosetId = '72157658896390092';
    var perPage = 12;
    $scope.page = 1;
    $scope.endOfAlbum = false;
    $scope.loadingPhotos = false;
    var src = 'flickr.photosets.getPhotos';
    $scope.loadPhotos = function(page) {
      $scope.loadingPhotos = true;
      flickr.query(src, perPage, page, photosetId)
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
    $scope.videoUrl = 'https://www.youtube.com/watch?v=3BvsZLwIBiE';
  });
