'use strict';

angular.module('lorenjonesApp')
  .factory('eventsFact', function (uiGmapGoogleMapApi, $q) {
    function getCoords(address, city) {
      var deferred = $q.defer();
      uiGmapGoogleMapApi.then(function(maps) {
        var geocoder = new maps.Geocoder();
        geocoder.geocode({'address': address + ',' + city}, function(results, status) {
          if (!results[0]) { return; }
          var lat = results[0].geometry.location.G;
          var lng = results[0].geometry.location.K;
          //return [lat, lng];
          deferred.resolve([lat, lng]);
        });
      }, function() {
        console.log('Server error');
      });
      return deferred.promise;
    }
    return {
      getCoords: getCoords
    };
  });
