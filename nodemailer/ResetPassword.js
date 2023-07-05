

const transporter = require('./transporter')

const user = process.env.email
console.log(user)
module.exports.sendResetPasswordEmail = (email, activationCode) => {
  transporter
    .sendMail({
      from: user,
      to: email,
      subject: "Modifier votre mot de passe",
      html: `
        <h1>Création d'un nouveau mot de passe</h1>
        <h2>Bonjour</h2>
        <p>Pour crée un nouveau mot de passe , veuillez cliquer sur ce lien :</p>
        <a href="http://localhost:3001/newpassword/${activationCode}">Cliquer ici !</a>
      `,
    })
    .catch((err) => console.log(err))
}
