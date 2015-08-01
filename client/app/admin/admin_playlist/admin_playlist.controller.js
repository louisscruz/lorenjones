'use strict';

angular.module('lorenjonesApp')
  .controller('AdminPlaylistCtrl', function ($scope, $rootScope, $http, socket, works, Modal) {

    $scope.sortableOptions = {
      'ui-floating': true,
      stop: function() {
        console.log()
      }
    };
    $scope.defaultTrack = works.defaultTrack;
    $scope.updateDefaultTrack = function(track) {
      works.updateDefaultTrack(track).success(function() {
        $scope.defaultTrack = works.defaultTrack;
        $scope.newLink = '';
      });
    };
    $scope.addDefaultTrack = function() {
      if($scope.newLink === '') {
        return;
      }
      if($scope.defaultTrack.length === 0) {
        $http.post('/api/default_tracks', {
          link: $scope.newLink
        });
        $scope.newLink = '';
      } else {
        var track = {
          link: $scope.newLink
        }
        $scope.updateDefaultTrack(track);
      }
    };
    $scope.deleteDefaultTrack = function() {
      works.deleteDefaultTrack().success(function() {
        $scope.$emit('tracksChanged');
      });
    };
    $scope.confirmDelete = Modal.confirm.delete(function() {
      $scope.deleteDefaultTrack();
    });
  });
