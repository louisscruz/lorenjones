'use strict';

var _ = require('lodash');
var Wg = require('./wg.model');

// Get list of wgs
exports.index = function(req, res) {
  Wg.find(function (err, wgs) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(wgs);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
