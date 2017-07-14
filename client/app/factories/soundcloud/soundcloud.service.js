'use strict';

angular.module('lorenjonesApp')
  .factory('soundcloud', ['soundcloudConfig', '$rootScope', '$http', '$q', function (soundcloudConfig, $rootScope, $http, $q) {
    var fact = {
      clientId: soundcloudConfig.clientId,
      audio: document.createElement('audio'),
      player: {
        currentTrack: false,
        playing: false,
        tracks: [],
        i: 0,
        playlistIndex: 0,
        data: {},
        currentTime: 0,
        duration: 0,
        errorOffset: 0,
        load: function(track, index) {
          fact.player.tracks[index] = track;
          if (!fact.player.playing && !fact.player.i && index === 0) {
            fact.player.currentTrack = fact.player.tracks[0];
          }
          fact.player.i++;
        },
        play: function(index) {
          /*jshint camelcase: false*/
          fact.player.i = index || 0;
          var track = fact.player.tracks[fact.player.i];
          var src;
          fact.player.playing = track;
          src = track.stream_url + '?client_id=' + fact.clientId;
          fact.player.currentTrack = fact.player.playing;
          if (src !== fact.audio.src) {
            fact.audio.src = src;
          }
          fact.audio.play();
        },
        pause: function() {
          fact.audio.pause();
          fact.player.playing = false;
        },
        playPause: function(index) {
          var i;
          if (index === undefined && !fact.player.currentTrack) {
            i = 0;
          } else if (index === undefined && fact.player.currentTrack) {
            i = fact.player.tracks.indexOf(fact.player.currentTrack);
          } else {
            i = index;
          }
          var track = fact.player.tracks[fact.player.i];
          if (fact.player.currentTrack !== fact.player.tracks[i] || fact.player.playing !== track) {
            fact.player.play(i);
          } else {
            fact.player.pause();
          }
        },
        next: function() {
          var playlist = fact.player.tracks[fact.player.i].tracks || null;
          if (playlist && fact.player.playlistIndex < playlist.length - 1) {
            fact.player.playlistIndex++;
            fact.player.play(fact.player.i, fact.player.playlistIndex);
          } else if (fact.player.i < fact.player.tracks.length - 1) {
            fact.player.i++;
            if (fact.player.tracks[fact.player.i].tracks) {
              playlist = fact.player.tracks[fact.player.i].tracks || null;
              fact.player.playlistIndex = 0;
              fact.player.play(fact.player.i, fact.player.playlistIndex);
            } else {
              fact.player.play(fact.player.i);
            }
          } else if (fact.player.i >= fact.player.tracks.length -1) {
            fact.player.pause();
          }
        },
        previous: function() {
          var playlist = fact.player.tracks[this.i].tracks || null;
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
          var audio = fact.audio;
          if (!audio.readyState) {
            return false;
          }
          var percent = 0;
          if ($(e.target).hasClass('progress')) {
            percent = e.offsetX / e.target.offsetWidth;
          } else {
            percent = e.offsetX / $(e.target).parent().width();
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
          var tracks = fact.player.tracks;
          for (var y = 0; y < tracks.length; y++) {
            /*jshint camelcase: false*/
            var track = tracks[y].permalink_url;

            if (track.indexOf('https') !== -1) {
              query = track.replace('https', 'http');
            }

            if (query === track) {
              mem = y;
              return mem;
            }
          }
          return mem;
        }
      }
    };
    fact.audio.addEventListener('timeupdate', function() {
      fact.player.currentTime = fact.audio.currentTime;
      fact.player.duration = fact.audio.duration;
      $rootScope.$apply(function() {
        $rootScope.player.currentTime = fact.player.currentTime;
        $rootScope.player.duration = fact.player.duration;
      });
    }, false);
    fact.audio.addEventListener('ended', function() {
      if (fact.player.tracks.length > 0) {
        fact.player.next();
      } else {
        fact.player.pause();
      }
    }, false);
    // Dump all tracks and data
    function dumpData() {
      fact.player.data = {};
      fact.player.tracks = [];
      fact.player.i = 0;
      fact.player.errorOffset = 0;
      return fact.player;
    }
    // Load track on an individual basis
    function loadPlayer(track, index) {
      /*jshint camelcase: false*/
      var params = {url: track, client_id: fact.clientId, callback: 'JSON_CALLBACK'};
      if (fact.player.data[track]) {
        var t = fact.player.data[track];
        fact.player.data[track] = t;
        fact.player.load(t, index);
      } else {
        $http.jsonp('//api.soundcloud.com/resolve.json', {params: params}).success(function(data) {
          fact.player.data[track] = data;
          fact.player.load(data, index - fact.player.errorOffset);
        }).error(function(data) {
          fact.player.errorOffset++;
          console.log(fact.player.errorOffset);
        });
      }
      return fact.player;
    }
    function testLoad(track) {
      /*jshint camelcase: false*/
      var deferred = $q.defer();
      if (!track) {
        deferred.resolve();
      }
      var params = {url: track, client_id: fact.clientId, callback: 'JSON_CALLBACK'};
      $http.jsonp('//api.soundcloud.com/resolve.json', {params: params}).success(function(data) {
        deferred.resolve(track);
      }).error(function() {
        deferred.reject('Invalid URL');
      });
      return deferred.promise;
    }
    return {
      player: fact.player,
      loadPlayerWith: loadPlayer,
      errorOffset: fact.player.errorOffset,
      dumpData: dumpData,
      testLoad: testLoad
    };
  }]);
