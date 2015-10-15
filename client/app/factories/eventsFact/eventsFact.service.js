'use strict';

angular.module('lorenjonesApp')
  .factory('eventsFact', function (uiGmapGoogleMapApi, $q) {
    function roundDate(timeStamp){
      timeStamp -= timeStamp % (24 * 60 * 60 * 1000);
      timeStamp += new Date().getTimezoneOffset() * 60 * 1000;
      return new Date(timeStamp);
    }
    function getCoords(address, city) {
      var deferred = $q.defer();
      uiGmapGoogleMapApi.then(function(maps) {
        var geocoder = new maps.Geocoder();
        geocoder.geocode({'address': address + ',' + city}, function(results) {
          if (!results[0]) { return; }
          var lat = results[0].geometry.location.lat();
          var lng = results[0].geometry.location.lng();
          var coords = [lat, lng];
          deferred.resolve(coords);
        });
      }, function() {
        console.log('Server error');
      });
      return deferred.promise;
    }
    return {
      roundDate: roundDate,
      getCoords: getCoords
    };
  });
