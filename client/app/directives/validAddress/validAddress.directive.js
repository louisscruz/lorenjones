'use strict';

angular.module('lorenjonesApp')
  .directive('validAddress', ['$http', '$q', 'uiGmapGoogleMapApi', '$compile', function ($http, $q, uiGmapGoogleMapApi, $compile) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $attr, $elem, ctrl) {
        ctrl.$asyncValidators.valid = function(address) {
          var deferred = $q.defer();
          if (!address) {
            deferred.resolve();
            return deferred.promise;
          }
          uiGmapGoogleMapApi.then(function(maps) {
            var geocoder = new maps.Geocoder();
            geocoder.geocode({'address': address}, function(results, status) {
              if (status === 'OK') {
                deferred.resolve();
              } else {
                deferred.reject();
              }
            });
          }, function() {
            console.log('Server error');
          });
          return deferred.promise;
        };
      }
    };
  }]);
