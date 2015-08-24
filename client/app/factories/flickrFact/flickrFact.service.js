'use strict';
angular.module('lorenjonesApp')
  .factory('flickr', ['$http', '$q',
    function($http, $q) {
      var o = {};
      var api_key = 'b288d1360b00e2f8584150f7da3ff3ef';
      var user_id = 'id=134139109@N08';
      var photoset_id = '72157657015377619';
      o.query = function(src, per_page, page) {
        console.log(page)
        var deferred = $q.defer();
        //if (o.photos) {
        if (o.photos && o.photos.length === per_page * page) {
          deferred.resolve(o.photos);
        } else {
          $http.jsonp('https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=b288d1360b00e2f8584150f7da3ff3ef&photoset_id=72157657015377619&user_id=134139109@N08&per_page=' + per_page + '&page=' + page + '&format=json&jsoncallback=JSON_CALLBACK', {
            cache: false
          })
          .then(function(result) {
            //if has photos, concat photos to old photos, else:
            o.photos = result.data.photoset.photo;
            for (var i = 0, len = o.photos.length; i < len; i++) {
              var photo = o.photos[i];
              o.photos[i].thumbnail = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_n.jpg';
              o.photos[i].url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
            }
            deferred.resolve(o.photos);
          }, function(error) {
            deferred.reject('Could not get json');
          });
        }
        return deferred.promise;
      };
      o.hasPhotos = function() {
        return !!o.photos;
      };
      return o;
    }
  ]);
