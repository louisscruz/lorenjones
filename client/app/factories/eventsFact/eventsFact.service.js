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
        console.log('made it this far');
        var geocoder = new maps.Geocoder();
        geocoder.geocode({'address': address + ',' + city}, function(results, status) {
          console.log(results);
          if (!results[0]) { return; }
          var lat = results[0].geometry.location.H;
          var lng = results[0].geometry.location.L;
          console.log(lat);
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
