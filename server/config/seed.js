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
var Wg = require('../api/wg/wg.model');

DbwMovement.find({}).remove(function() {
  DbwMovement.create({
    movement: 1,
    audio: 'https://soundcloud.com/lorenjones-2/1-ohlone-song'
  }, {
    movement: 4,
    audio: 'https://soundcloud.com/lorenjones-2/4-dragon-gate'
  }, {
    movement: 9,
    audio: 'https://soundcloud.com/lorenjones-2/9-playland'
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

Wg.find({}).remove(function() {
  Wg.create({
    title: 'Cathedral',
    url: 'https://soundcloud.com/lorenjones-2/1-cathedral'
  }, {
    title: 'Emerald Green',
    url: 'https://soundcloud.com/lorenjones-2/2-emerald-green'
  }, {
    title: 'The Exotic Pond',
    url: 'https://soundcloud.com/lorenjones-2/3-the-exotic-pond'
  }, {
    title: 'Woodward\'s Gardens',
    url: 'https://soundcloud.com/lorenjones-2/4-woodwards-gardens'
  }, {
    title: 'Old Photographs',
    url: 'https://soundcloud.com/lorenjones-2/5-old-photographs'
  }, {
    title: 'The New Century',
    url: 'https://soundcloud.com/lorenjones-2/6-the-new-century'
  }, {
    title: 'Piece for Flute, Cello & Piano',
    url: 'https://soundcloud.com/lorenjones-2/7-piece-for-flute-cello-piano'
  }, {
    title: 'Man With 4 Hands',
    url: 'https://soundcloud.com/lorenjones-2/8-man-with-4-hands'
  }, {
    title: 'Dreaming',
    url: 'https://soundcloud.com/lorenjones-2/09-dreaming'
  }, {
    title: 'Arden',
    url: 'https://soundcloud.com/lorenjones-2/10-arden'
  }, {
    title: 'Touchstone',
    url: 'https://soundcloud.com/lorenjones-2/11-touchstone'
  }, {
    title: 'A Victorian in Egypt',
    url: 'https://soundcloud.com/lorenjones-2/12-a-victorian-in-egypt'
  }, {
    title: 'Sands of Time',
    url: 'https://soundcloud.com/lorenjones-2/sands-of-time'
  }, {
    title: 'Home',
    url: 'https://soundcloud.com/lorenjones-2/home'
  });
});

/*BioEntry.find({}).remove(function() {
  BioEntry.create({
    title: 'Short',
    content: 'This is the shortest one.',
    index: 0
  }, {
    title: 'Medium',
    content: 'This is one here is longer than the shortest.',
    index: 1
  }, {
    title: 'Long',
    content: 'This is definitely the longest entry that we have seen so far. And it will be the last, for now.',
    index: 2
  });
});*/

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
