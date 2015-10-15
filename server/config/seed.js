/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var BioEntry = require('../api/bio_entry/bio_entry.model');
var DefaultTrack = require('../api/default_track/default_track.model');
var DbwMovement = require('../api/dbw_movement/dbw_movement.model');
var Playlist = require('../api/playlist/playlist.model');

DbwMovement.find({}).remove(function() {
  DbwMovement.create({
    movement: 1,
    audio: 'https://soundcloud.com/lorenjones-2/1-ohlone-song'
  }, function() {
    console.log('finished populating dbw movements');
  });
});
if (Playlist.count() === 0 ) {
  Playlist.find({}).remove(function() {
    Playlist.create({
      order: [0]
    });
  });
}

/*Playlist.find({}).remove(function() {
  Playlist.create({
    order: [1, 0, 2, 3]
  });
});*/

/*User.find({}).remove(function() {
  User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'lorenjjones@earthlink.net',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'lsc@juilliard.edu',
    password: 'test'
  }, function() {
      console.log('finished populating users');
    }
  );
});*/
