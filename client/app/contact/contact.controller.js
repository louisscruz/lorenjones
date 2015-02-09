'use strict';

angular.module('louiscruzApp')
  .controller('ContactCtrl', function ($scope, $http, socket) {
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
