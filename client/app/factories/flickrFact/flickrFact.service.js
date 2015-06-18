'use strict';

angular.module('lorenjonesApp')
  .factory('flickr', ['$http', '$q',
    function($http, $q) {
      var o = {};

      o.query = function(src) {
        var deferred = $q.defer();

        if (o.photos) {
          deferred.resolve(o.photos);
        } else {
          $http.jsonp('http://www.flickr.com/services/feeds/' + src + '&lang=en-us&format=json&jsoncallback=JSON_CALLBACK', {
            cache: true
          })
          .success(function(result) {
            o.photos = result.items;

            angular.forEach(o.photos, function(p) {
              p.image = p.media.m.replace('_m', '_z');
            });

            deferred.resolve(o.photos);
          })
          .error(function() {
            deferred.reject('Could not get json');
          });
        }

        return deferred.promise;
      }

      o.hasPhotos = function() {
        return !!o.photos;
      };

      return o;
    }
  ]);
