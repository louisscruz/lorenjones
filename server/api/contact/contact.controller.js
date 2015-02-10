'use strict';

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lsc@juilliard.edu',
    pass: 'sofjfjfjf'
  }
});

exports.send = function(req,res){
  var mailOptions = {
    to: 'lsc@juilliard.edu',
    subject: 'New contact from ',
    from: req.data.from,
    html: req.data.body
  };
  transporter.sendMail(mailOptions, function(err, info){
    if (err) {
      console.log(err);
    }else{
      console.log('Message sent: ' + info.response);
    }
  });
}
