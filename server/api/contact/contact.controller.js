'use strict';

var _ = require('lodash');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CONTACT_EMAIL_ADDRESS || CONTACT_EMAIL_ADDRESS, //jshint ignore:line
    pass: process.env.CONTACT_EMAIL_PASSWORD || CONTACT_EMAIL_PASSWORD//jshint ignore:line
  }
});

exports.sendMail = function(req, res) {
  var data = req.body;
  var mailOptions = {
    from: data.email,
    to: 'lorenjjones@earthlink.net',
    subject: 'Message from ' + data.name,
    text: data.message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log('Message sent: ' + info.response);
      res.json(data);
    }
  });
};
function handleError(res, error) {
  return res.status(500).send(error);
}
