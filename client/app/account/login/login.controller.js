'use strict';

angular.module('lorenjonesApp')
  .controller('LoginCtrl', function ($scope, Auth, alertFact, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(isValid) {
      $scope.submitted = true;
      if(isValid) {
        var data = {
          email: $scope.user.email,
          password: $scope.user.password
        };
        $scope.cache = data;
        Auth.login({
          email: data.email,
          password: data.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          //$scope.errors.other = err.message;
          alertFact.add('danger', err.message);
        });
      }
    };

  });
