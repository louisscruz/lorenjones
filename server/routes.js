/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/dbw_movements', require('./api/dbw_movement'));
  app.use('/api/playlists', require('./api/playlist'));
  app.use('/api/default_tracks', require('./api/default_track'));
  app.use('/api/photos', require('./api/photo'));
  app.use('/api/bio_entries', require('./api/bio_entry'));
  app.use('/api/works', require('./api/work'));
  app.use('/api/events', require('./api/event'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/contact', require('./api/contact'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
