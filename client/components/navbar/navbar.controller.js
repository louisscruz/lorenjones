'use strict';

angular.module('louiscruzApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/'
    },

    {
      'title': 'About',
      'link': '/about'
    },

    {
      'title': 'Events',
      'link': '/events'
    },

    {
      'title': 'Works',
      'link': '/works'
    },

    {
      'title': 'Contact',
      'link': '/contact'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
