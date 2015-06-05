/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var BioEntry = require('../api/bio_entry/bio_entry.model');
var DefaultTrack = require('../api/default_track/default_track.model');

/**User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'lsc@juilliard.edu',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
*/
