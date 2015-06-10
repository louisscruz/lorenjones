'use strict';

angular.module('lorenjonesApp')
  .controller('DbwCtrl', function ($scope, stellar) {
    stellar.against('body, .stellar-window, .stellar-image');
  });
