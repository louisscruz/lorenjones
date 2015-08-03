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
        addKeys: function(track) {
          for (var key in track) {
            this[key] = track[key];
          }
        },
        load: function(track, index) {
          this.tracks[index] = track;
          if (!this.playing && !this.i && index === 0) {
            this.currentTrack = this.tracks[0];
          }
        },
        play: function(index, playlistIndex) {
          fact.player.i = index || 0;
          var track = fact.player.tracks[fact.player.i];
          var src = null;
          if (track.tracks) {
            fact.player.playlistIndex = playlistIndex || 0;
            fact.player.playing = track.tracks[fact.player.playlistIndex];
            src = track.tracks[fact.player.playlistIndex].stream_url + '?client_id=' + fact.clientId;
          } else {
            fact.player.playing = track;
            src = track.stream_url + '?client_id=' + fact.clientId;
          }
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
        playPause: function(i, playlistIndex) {
          var track = fact.player.tracks[fact.player.i];
          console.log(track);
          /*if (track.tracks !== null && fact.player.playing !== track.tracks[playlistIndex]) {
            fact.player.play(i, playlistIndex);
          } else */if (!track.tracks && fact.player.playing !== track) {
            fact.player.play(i);
          } else {
            fact.player.pause();
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
              playlist = this.tracks[this.i].tracks || null;
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
          var tracks = this.tracks;
          for (var y = 0; y < tracks.length; y++) {
            if (query === tracks[y].permalink_url) {
              mem = y;
              return mem;
            }
          }
        }
      }
    };
    var params = {client_id: fact.clientId, callback: 'JSON_CALLBACK'};

    function loadPlayer(track, index) {
      var src = track;
      params.url = src;
      if (!src) {
      } else if(fact.player.data[src]) {
        console.log('data already exists');
        var t = fact.player.data[src];
        fact.player.load(t, index);
      } else {
        $http.jsonp('//api.soundcloud.com/resolve.json', {params: params}).success(function(data) {
          var t = data;
          fact.player.data[src] = data;
          fact.player.load(t, index);
          /*fact.player.tracks[index] = data;
          if (!fact.player.playing && !fact.player.i && index === 0) {
            fact.player.currentTrack = fact.player.tracks[0];
          }*/
        });
      };
      return fact.player;
    };

    return {
      player: fact.player,
      loadPlayerWith: loadPlayer
    };
  }]);
