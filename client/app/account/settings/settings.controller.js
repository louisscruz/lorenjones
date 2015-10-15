'use strict';

angular.module('lorenjonesApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $location, alertFact) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          alertFact.add('success', 'Your password was successfully changed!');
          $location.path('/');
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          alertFact.add('danger', 'Unsuccessful attempt to change password.');
        });
      }
		};
  });
