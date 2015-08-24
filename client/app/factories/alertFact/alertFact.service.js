'use strict';

angular.module('lorenjonesApp')
  .factory('alertFact', function ($rootScope, $timeout) {
    $rootScope.alerts = [];
    var alertFact = {
      add: function(type, msg) {
        var alert = {
          type: type,
          msg: msg,
          close: function() {
            $rootScope.alerts.splice($rootScope.alerts.indexOf(this), 1);
          }
        };
        $timeout(function() {
          $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
        return $rootScope.alerts.push(alert);
      },
      closeAlertIdx: function(index) {
        return $rootScope.alerts.splice(index, 1);
      },
      closeAlert: function(alert) {
        return alertFact.closeAlertIdx($rootScope.alerts.indexOf(alert));
      }
    };
    return alertFact;
  });
