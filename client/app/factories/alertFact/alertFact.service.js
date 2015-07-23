'use strict';

angular.module('lorenjonesApp')
  .factory('alertFact', function ($rootScope, $timeout) {
    var alertFact;
    $rootScope.alerts = [];
    return alertFact = {
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
      closeAlert: function(alert) {
        return closeAlertIdx(alerts.indexOf(alert));
      },
      closeAlertIdx: function(index) {
        return $rootScope.alerts.splice(index, 1);
      }
    };
  });
