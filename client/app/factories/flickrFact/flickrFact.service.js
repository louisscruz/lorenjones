'use strict';
angular.module('lorenjonesApp')
  .factory('flickr', ['$http', '$q',
    function($http, $q) {
      var o = {};
      var apiKey = 'b288d1360b00e2f8584150f7da3ff3ef';
      var userId = '134139109@N08';
      var photosetId = '72157657015377619';
      o.query = function(src, perPage, page) {
        /*jshint camelcase: false*/
        var deferred = $q.defer();
        $http.jsonp('https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=' + apiKey + '&photoset_id=' + photosetId + '&user_id=' + userId + '&per_page=' + perPage + '&page=' + page + '&format=json&jsoncallback=JSON_CALLBACK', {
          cache: false
        })
        .then(function(result) {
          console.log(result);
            //if has photos, concat photos to old photos, else:
          o.photos = result.data.photoset.photo;
          for (var i = 0, len = o.photos.length; i < len; i++) {
            var photo = o.photos[i];
            o.photos[i].thumbnail = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_n.jpg';
            o.photos[i].url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
            o.photos[i].caption = o.photos[i].title;
          }
          deferred.resolve(o.photos);
        }, function() {
          deferred.reject('Could not get json');
        });
      return deferred.promise;
      };
      return o;
    }
  ]);
