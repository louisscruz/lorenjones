'use strict';

angular.module('lorenjonesApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.closeCollapsed = function() {
      $scope.isCollapsed = true;
    };
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
