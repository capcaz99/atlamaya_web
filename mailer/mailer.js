var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'condominioatlamaya@gmail.com',
    pass: 'Carlos@1812'
  }
});



var mailOptions = {
  from: 'condominioatlamaya@gmail.com',
  to: 'c@yahoo.com',
  subject: 'Cambio de contraseña',
  text: 'Para poder cambiar tu contraseña ve a este link para hacerlo: '
};


transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});