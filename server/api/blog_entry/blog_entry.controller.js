'use strict';

var _ = require('lodash');
var BlogEntry = require('./blog_entry.model');

// Get list of blog_entrys
exports.index = function(req, res) {
  BlogEntry.find(function (err, blog_entrys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(blog_entrys);
  });
};

// Get a single blog_entry
exports.show = function(req, res) {
  BlogEntry.findById(req.params.id, function (err, blog_entry) {
    if(err) { return handleError(res, err); }
    if(!blog_entry) { return res.status(404).send('Not Found'); }
    return res.json(blog_entry);
  });
};

// Creates a new blog_entry in the DB.
exports.create = function(req, res) {
  BlogEntry.create(req.body, function(err, blog_entry) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(blog_entry);
  });
};

// Updates an existing blog_entry in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  BlogEntry.findById(req.params.id, function (err, blog_entry) {
    if (err) { return handleError(res, err); }
    if(!blog_entry) { return res.status(404).send('Not Found'); }
    var updated = _.merge(blog_entry, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(blog_entry);
    });
  });
};

// Deletes a blog_entry from the DB.
exports.destroy = function(req, res) {
  BlogEntry.findById(req.params.id, function (err, blog_entry) {
    if(err) { return handleError(res, err); }
    if(!blog_entry) { return res.status(404).send('Not Found'); }
    blog_entry.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}