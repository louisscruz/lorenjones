'use strict';

angular.module('lorenjonesApp')
  .factory('instagram', ['$http',
    function($http) {
      return {
        fetchPopular: function(callback) {
          var endPoint = "https://api.instagram.com/v1/users/1545705357/media/recent?callback=JSON_CALLBACK&client_id=65568cd5ceaf443a8816303a0fa6de61";
          $http.jsonp(endPoint).success(function(response) {
            callback(response.data);
          });
        }
      }
    }
  ])
