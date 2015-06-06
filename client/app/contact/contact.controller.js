'use strict';

angular.module('lorenjonesApp')
  .controller('ContactCtrl', function ($scope, $http) {
    var ctrl = this;

    ctrl.emailData = {
        from: '',
        name: '',
        body: ''
    };

    ctrl.postMail = function (data) {
        $http.post('/api/contact', data);
    };
  });
