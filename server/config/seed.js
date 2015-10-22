/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var BioEntry = require('../api/bio_entry/bio_entry.model');
var DefaultTrack = require('../api/default_track/default_track.model');
var DbwMovement = require('../api/dbw_movement/dbw_movement.model');
var SweetTommyTrack = require('../api/sweet_tommy_track/sweet_tommy_track.model');
var Playlist = require('../api/playlist/playlist.model');

DbwMovement.find({}).remove(function() {
  DbwMovement.create({
    movement: 1,
    audio: 'https://soundcloud.com/lorenjones-2/1-ohlone-song'
  }, {
    movement: 7,
    audio: 'https://soundcloud.com/lorenjones-2/7-the-outside-lands'
  }, {
    movement: 13,
    audio: 'https://soundcloud.com/lorenjones-2/13-the-castro-lounge'
  }, {
    movement: 14,
    audio: 'https://soundcloud.com/lorenjones-2/14-the-city-by-the-sea'
  }, function() {
    console.log('finished populating dbw movements');
  });
});

/*if (Playlist.count() === 0 ) {
  Playlist.find({}).remove(function() {
    Playlist.create({
      order: [0]
    });
  });
}*/

SweetTommyTrack.find({}).remove(function() {
  SweetTommyTrack.create({
    title: 'Swingin\' Chains',
    credit: 'Cullinen/Christy',
    url: 'https://soundcloud.com/lorenjones-2/1-swingin-chains'
  }, {
    title: 'Game of Love',
    credit: 'C. Ballard Jr., ASCAP',
    url: 'https://soundcloud.com/lorenjones-2/2-game-of-love'
  }, {
    title: 'The World of Science',
    credit: 'Cullinen',
    url: 'https://soundcloud.com/lorenjones-2/3-the-world-of-science'
  }, {
    title: 'Space Station Control',
    credit: 'Jones',
    url: 'https://soundcloud.com/lorenjones-2/4-space-station-control'
  }, {
    title: 'Ride My Current',
    credit: 'Cullinen/Christy',
    url: 'https://soundcloud.com/lorenjones-2/5-ride-my-current'
  }, {
    title: 'She Don\'t Respond',
    credit: 'Cullinen',
    url: 'https://soundcloud.com/lorenjones-2/6-she-dont-respond'
  }, {
    title: 'Beatniks',
    credit: 'Cullinen/Christy/Morales',
    url: 'https://soundcloud.com/lorenjones-2/7-beatnicks'
  }, {
    title: 'Bobo Takes a Walk',
    credit: 'Christy',
    url: 'https://soundcloud.com/lorenjones-2/8-bobo-takes-a-walk'
  }, {
    title: 'Time Warp 17',
    url: 'https://soundcloud.com/lorenjones-2/9-timewarp-17'
  });
});

/*Playlist.find({}).remove(function() {
  Playlist.create({
    order: [0, 1]
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
