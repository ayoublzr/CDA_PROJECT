const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // true si votre serveur SMTP nécessite une connexion sécurisée (SSL/TLS)
  auth: {
    user: 'ayoublzr1993@outlook.fr', // Adresse e-mail de l'expéditeur
    pass: 'Motdepasse06' // Mot de passe de l'expéditeur
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports.sendConfirmationEmail = (email, activationCode) => {
  transporter
    .sendMail({
      from: 'ayoublzr1993@outlook.fr',
      to: email,
      subject: 'Confirmer votre compte',
      html: `
        <h1>Email de Confirmation</h1>
        <h2>Bonjour</h2>
        <p>Pour activer votre compte, veuillez cliquer sur ce lien :</p>
        <a href="http://localhost:3001/confirm/${activationCode}">Cliquer ici !</a>
      `
    })
    .catch((err) => console.log(err));
};
