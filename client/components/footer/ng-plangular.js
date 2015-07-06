/*
        PLANGULAR
        A Highly Customizable SoundCloud Player
        Angular Version
        http://jxnblk.github.io/Plangular
 */

(function() {

'use strict';

var plangular = angular.module('plangular', []);

plangular.directive('plangular', ['$http', 'plangularConfig', function ($http, plangularConfig) {
  var clientId = plangularConfig.clientId;

  var audio = document.createElement('audio');

  var player = {

    currentTrack: false,
    playing: false,
    tracks: [],
    i: 0,
    playlistIndex: 0,
    data: {},
    currentTime: 0,
    duration: 0,

    load: function(track, index) {
      this.tracks[index] = track;
      if (!this.playing && !this.i && index == 0) {
        this.currentTrack = this.tracks[0];
      }
    },

    play: function(index, playlistIndex) {
      this.i = index || 0;
      var track = this.tracks[this.i];
      if (track.tracks) {
        this.playlistIndex = playlistIndex || 0;
        this.playing = track.tracks[this.playlistIndex];
        var src = track.tracks[this.playlistIndex].stream_url + '?client_id=' + clientId;
      } else {
        this.playing = track;
        var src = track.stream_url + '?client_id=' + clientId;
      }
      this.currentTrack = this.playing;
      if (src != audio.src) audio.src = src;
      audio.play();
    },

    pause: function() {
      audio.pause();
      this.playing = false;
    },

    playPause: function(i, playlistIndex) {
      var track = this.tracks[i];
      if (track.tracks && this.playing != track.tracks[playlistIndex]) {
        this.play(i, playlistIndex);
      } else if (!track.tracks && this.playing != track) {
        this.play(i);
      } else {
        this.pause();
      }
    },

    next: function() {
      var playlist = this.tracks[this.i].tracks || null;
      if (playlist && this.playlistIndex < playlist.length - 1) {
        this.playlistIndex++;
        this.play(this.i, this.playlistIndex);
      } else if (this.i < this.tracks.length - 1) {
        this.i++;
        // Handle advancing to new playlist
        if (this.tracks[this.i].tracks) {
          var playlist = this.tracks[this.i].tracks || null;
          this.playlistIndex = 0;
          this.play(this.i, this.playlistIndex);
        } else {
          this.play(this.i);
        }
      } else if (this.i >= this.tracks.length -1) {
        this.pause();
      }
    },

    previous: function() {
      var playlist = this.tracks[this.i].tracks || null;
      if (playlist && this.playlistIndex > 0) {
        this.playlistIndex--;
        this.play(this.i, this.playlistIndex);
      } else if (this.i > 0) {
        this.i--;
        if (this.tracks[this.i].tracks) {
          this.playlistIndex = this.tracks[this.i].tracks.length - 1;
          this.play(this.i, this.playlistIndex);
        } else {
          this.play(this.i);
        }
      }
    },

    seek: function(e) {
      if (!audio.readyState) return false;
      if ($(e.target).hasClass('progress')) {
        var percent = e.offsetX / e.target.offsetWidth;
      } else {
        var percent = e.offsetX / $(e.target).parent().width();
      }
      var time = percent * audio.duration || 0;
      audio.currentTime = time;
    },

    trackIndex: function(query) {
      var mem = null;
      //clean https
      if (query.indexOf('https') !== -1) {
        query = query.replace('https', 'http');
      }
      //get index
      var tracks = this.tracks;
      for (var y = 0; y < tracks.length; y++) {
        if (query === tracks[y].permalink_url) {
          mem = y;
          return mem;
        }
      }
    },

    sameTrack: function(url) {
      var u = url;
      var current = this.currentTrack.permalink_url;
      //clean https
      if (u.indexOf('https') !== -1) {
        u = u.replace('https', 'http');
      }

      //track same
      if (u === currentTrack.permalink_url) {
        return true;
      } else {
        return false;
      }
    }

  };

  audio.addEventListener('timeupdate', function() {
    player.currentTime = audio.currentTime;
    player.duration = audio.duration;
  }, false);

  audio.addEventListener('ended', function() {
    if (player.tracks.length > 0) player.next();
    else player.pause();
  }, false);

  var index = 0;

  return {

    restrict: 'A',
    scope: true,

    link: function (scope, elem, attrs) {

      var src = attrs.plangular;
      var params = { url: src, client_id: clientId, callback: 'JSON_CALLBACK' }

      scope.player = player;
      scope.audio = audio;
      scope.currentTime = 0;
      scope.duration = 0;
      if (src) {
        scope.index = index;
        index++;
      }

      function addKeys(track) {
        for (var key in track) {
          scope[key] = track[key];
        }
      }

      if (!src) {
        //console.log('no src');
      } else if (player.data[src]) {
        scope.track = player.data[src];
        addKeys(scope.track);
        player.load(scope.track, scope.index);
      } else {
        $http.jsonp('//api.soundcloud.com/resolve.json', { params: params }).success(function(data){
          scope.track = data;
          addKeys(scope.track);
          player.data[src] = data;
          player.load(data, scope.index);
        });
      }

      scope.play = function(playlistIndex) {
        player.play(scope.index, playlistIndex);
      };

      scope.pause = function() {
        player.pause();
      };

      scope.playPause = function(playlistIndex) {
        var i = scope.index || player.i;
        player.playPause(i, playlistIndex);
      };

      scope.playTrack = function(t) {

      }

      scope.next = function() {
        player.next();
      };

      scope.previous = function() {
        player.previous();
      };

      audio.addEventListener('timeupdate', function() {
        if (scope.track == player.tracks[player.i]){
          scope.$apply(function() {
            scope.currentTime = player.currentTime;
            scope.duration = player.duration;
          });
        } else {
          scope.$apply(function() {
            scope.currentTime = player.currentTime;
            scope.duration = player.duration;
          });
        };
      }, false);

      scope.seek = function(e){
        if (player.tracks[player.i] == scope.track) {
          player.seek(e);
        }
      };

    }

  }

}]);

// Filter to convert milliseconds to hours, minutes, seconds
plangular.filter('prettyTime', function() {
  return function(value) {
    var hours = Math.floor(value / 3600),
        mins = '0' + Math.floor((value % 3600) / 60),
        secs = '0' + Math.floor((value % 60));
        mins = mins.substr(mins.length - 2);
        secs = secs.substr(secs.length - 2);
    if(!isNaN(secs)){
      if (hours){
        return hours+':'+mins+':'+secs;
      } else {
        return mins+':'+secs;
      };
    } else {
      return '00:00';
    };
  };
});

plangular.provider('plangularConfig', function() {
  this.clientId = 'a7654b6d1d451c513253de1b4dc8a65d';
  var _this = this;
  this.$get = function() {
    return {
      clientId: _this.clientId
    };
  };
});


})();
