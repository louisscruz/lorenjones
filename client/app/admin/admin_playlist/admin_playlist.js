'use strict';

angular.module('lorenjonesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_playlist', {
        url: '/admin/playlist',
        templateUrl: 'app/admin/admin_playlist/admin_playlist.html',
        controller: 'AdminPlaylistCtrl'
      });
  });
