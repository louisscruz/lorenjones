'use strict';

angular.module('louiscruzApp')
  .controller('AboutCtrl', function ($scope, $http, socket, $interval, instagram) {
    $scope.bioEntries = [];

    $http.get('/api/bio_entries').success(function(bioEntries) {
      $scope.bioEntries = bioEntries;
      socket.syncUpdates('bio_entry', $scope.bioEntries);
    });

    $scope.pics = [];
    $scope.have = [];
    $scope.orderBy = "-likes.count";
    $scope.getMore = function() {
      instagram.fetchPopular(function(data) {
          for(var i=0; i<data.length; i++) {
            if (typeof $scope.have[data[i].id]==="undefined") {
              $scope.pics.push(data[i]) ;
              $scope.have[data[i].id] = "1";
            }
          }
      });
    };
    $scope.getMore();

    $scope.tags = [
        'Bootstrap', 'AngularJS', 'Instagram', 'Factory'
    ]
  });
