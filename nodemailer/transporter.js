const nodemailer = require('nodemailer');
const user = process.env.email;
const pass = process.env.password;
console.log(`${user} 6666`)
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: user,
    pass: pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;