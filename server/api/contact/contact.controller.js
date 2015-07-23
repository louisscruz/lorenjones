'use strict';

var _ = require('lodash');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});

exports.sendMail = function(req, res) {
  var data = req.body;
  var mailOptions = {
    from: data.email,
    to: 'louisstephancruz@me.com',
    subject: 'Message from' + data.name,
    text: data.message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });

  res.json(data);
};
function handleError(res, error) {
  return res.status(500).send(error);
}
