const nodemailer = require("nodemailer");
require('dotenv').config();
const user = process.env.email;
const pass = process.env.password;
console.log(user);
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: user,
    pass: pass
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports.sendConfirmationEmail = (email, activationCode) => {
  transporter
    .sendMail({
      from: user,
      to: email,
      subject: "Confirmer votre compte",
      html: `
        <h1>Email de Confirmation</h1>
        <div> pass : ${pass} ${user}</div>
        <h2>Bonjour</h2>
        <p>Pour activer votre compte, veuillez cliquer sur ce lien :</p>
        <a href="http://localhost:3001/confirm/${activationCode}">Cliquer ici !</a>
      `,
    })
    .catch((err) => console.log(err));
};
