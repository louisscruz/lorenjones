'use strict';

angular.module('lorenjonesApp')
  .controller('ContactCtrl', function ($scope, $http, alertFact, $location) {
    $scope.contact = {};
    $scope.sending = false;
    $scope.cache = null;
    $scope.submitForm = function(isValid) {
      if (isValid) {
        $scope.sending = true;
        var data = ({
          name: $scope.contact.name,
          email: $scope.contact.email,
          message: $scope.contact.message
        });
        $scope.cache = data;
        $http.post('/api/contact', data)
          .success(function(d) {
            alertFact.add('success', d.name + ', thank you for the message. I\'ll get back to you soon!');
            $scope.sending = false;
            $location.path('/');
          })
          .error(function(d) {
            $scope.sending = false;
            alertFact.add('danger', 'We could not deliver your message. Modify your message and try again, or send your message to louisstephancruz@me.com.');
          })
      }
    }
  });
