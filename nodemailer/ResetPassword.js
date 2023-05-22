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

module.exports.sendResetPasswordEmail = (email, activationCode) => {
  transporter
    .sendMail({
      from: 'ayoublzr1993@outlook.fr',
      to: email,
      subject: 'Modifier votre mot de passe',
      html: `
        <h1>Création d'un nouveau mot de passe</h1>
        <h2>Bonjour</h2>
        <p>Pour crée un nouveau mot de passe , veuillez cliquer sur ce lien :</p>
        <a href="http://localhost:3001/newpassword/${activationCode}">Cliquer ici !</a>
      `
    })
    .catch((err) => console.log(err));
};
