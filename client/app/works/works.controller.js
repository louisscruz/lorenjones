'use strict';

angular.module('lorenjonesApp')
  .controller('WorksCtrl', function ($scope, works, $location) {
    $scope.projects = [{
      title: 'Dancing on the Brink of the World',
      audio: 'https://soundcloud.com/lorenjones-2/14-the-city-by-the-sea',
      link: '/dbw'
    }, {
      title: 'Woodward\'s Garden',
      audio: '',
      link: '/woodwards-garden'
    }, {
      title: 'Sweet Tommy',
      audio: 'https://soundcloud.com/lorenjones-2/1-swingin-chains',
      link: '/sweet-tommy'
    }];
    $scope.goTo = function(url) {
      $location.path(url)
    };
    $scope.info = '';
    $scope.toggle = function(id) {
      if (id === '' || id !== $scope.info) {
        $scope.info = id;
      } else {
        $scope.info = '';
      }
    };
  });
