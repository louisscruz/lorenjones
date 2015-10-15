'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/sweet_tommy_tracks', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/sweet_tommy_tracks')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});