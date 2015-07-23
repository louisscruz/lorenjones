'use strict';

angular.module('lorenjonesApp')
  .controller('ContactCtrl', function ($scope, $http, alertFact) {
    $scope.contact = {};
    $scope.submitForm = function(isValid) {
      if (isValid) {
        var data = ({
          name: $scope.contact.name,
          email: $scope.contact.email,
          message: $scope.contact.message
        });
        $http.post('/api/contact', data)
          .success(function(d) {
            alertFact.add('success', d.name + ', thank you for the message. We will get back to you soon!');
          })
          .error(function(d) {
            alertFact.add('danger', 'We could not deliver your message.');
          })
      }
    }
  });
