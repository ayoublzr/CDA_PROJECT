const db = require("../models")
const nodemailer = require("nodemailer")
const mail = process.env.email
const pass = process.env.password


exports.sendDevis = (req, res) => {
  const { UserId, token, DeviId } = req.body
  
  const cleanToken = token.replace(/^"(.*)"$/, "$1")
  db.User.findByPk(UserId)
    .then((user) => {
      
      if (user && user.token === cleanToken) {
        const transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          port: 587,
          secure: false,
          auth: {
            user: mail,
            pass: pass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        })

        db.sequelize
        .query(`CALL GetDevisDetails(${DeviId})`)
          .then((results) => {
            if (results.length > 0) {
              // Construction du corps de l'e-mail
              let emailBody = `Bonjour,
              
              Vous avez reçu une demande de devis. Voici les détails :
              
              Utilisateur :
              - Nom d'utilisateur : ${user.username}
              - Téléphone : ${user.phone}
              - E-mail : ${user.email}
              
              Devis :`

              // Ajouter les détails du devis
              let counter = 1
              results.forEach((result) => {
                emailBody += `
                Produit ${counter} :
                - Produit : ${result.ProductName}
                - Catégorie : ${result.CategoryName}
                - Surface : ${result.surface}
                - Description : ${result.detail}`

                counter++
              })

              emailBody += `
              - Commentaire : ${results[0].Commentaire}
              Cordialement,
              Votre application de devis
              `

              
              const mailOptions = {
                from: mail,
                to: user.email,
                subject: "Nouvelle demande de devis",
                text: emailBody,
              }

              // Envoi de l'e-mail
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error)
                  res.status(500).json({
                    message:
                      "Une erreur s'est produite lors de l'envoi du devis par email.",
                  })
                } else {
                  res.status(200).json({
                    message: "Le devis a été envoyé avec succès.",
                  })
                }
              })
            } else {
              res.status(404).json({
                message: "Le devis spécifié n'a pas été trouvé.",
              })
            }
          })
          .catch((error) => {
            console.log(error)
            res.status(500).json({
              message:
                "Une erreur s'est produite lors de l'exécution de la requête SQL personnalisée.",
            })
          })
      } else {
        res.status(401).json({
          message: "Utilisateur non autorisé.",
        })
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message:
          "Une erreur s'est produite lors de la recherche de l'utilisateur.",
      })
    })
}

exports.createDevis = (req, res) => {
  const { UserId, commentaire } = req.body

  db.Devis.create({ UserId, commentaire })
    .then((devis) => {
      res.status(201).json({ id: devis.id })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Une erreur est survenue lors de la création du devis.",
      })
    })
}

exports.createDevisDetails = (req, res) => {
  const { surface, detail, DeviId, ProductId } = req.body

  db.DevisDetails.create({ surface, detail, DeviId, ProductId })
    .then((devisDetails) => {
      res.status(201).json({ id: devisDetails.id })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message:
          "Une erreur est survenue lors de la création des détails du devis.",
      })
    })
}

exports.getDevisList = (req, res) => {
  db.sequelize
    .query("CALL GetDevisInfos()")

    .then((results) => {
      console.log(results)
      res.status(200).json(results)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message:
          "Une erreur est survenue lors de la récupération de la liste des devis.",
      })
    })
}

exports.deleteDevis = (req, res) => {
  const { id } = req.params

  db.Devis.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      res.status(200).json({ message: "Le devis a été supprimé avec succès." })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Une erreur est survenue lors de la suppression du devis.",
      })
    })
}
