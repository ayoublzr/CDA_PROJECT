const express = require("express");
const route = express.Router();
const db = require("../models");
const nodemailer = require("nodemailer");

route.post("/api/sendDevis", (req, res) => {
  const { UserId, token, DeviId } = req.body;
  console.log(DeviId); // Vérifiez l'orthographe de DeviId
  
  // Recherche de l'utilisateur
  db.User.findByPk(UserId)
    .then((user) => {
      if (user && user.token === token) {
        // Configuration du transporteur SMTP
        const transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          port: 587,
          secure: false,
          auth: {
            user: "ayoublzr1993@outlook.fr",
            pass: "Motdepasse06",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        // Exécution de la requête SQL personnalisée
        db.sequelize
          .query(
            `SELECT d.id AS DevId,d.commentaire as Commentaire, p.name AS ProductName, c.name AS CategoryName, dd.surface, dd.detail, u.username, u.email, u.phone
            FROM devis AS d
            JOIN devisdetails dd ON dd.DeviId = d.id
            JOIN products p ON p.Id = dd.ProductId
            JOIN categories c ON c.Id = p.CategorieId
            JOIN users u ON u.id = d.UserId
            WHERE d.id = :DeviId
            ORDER BY d.id`,
            {
              replacements: { DeviId },
              type: db.sequelize.QueryTypes.SELECT
            }
          )
          .then((results) => {
            if (results.length > 0) {
              // Construction du corps de l'e-mail
              let emailBody = `Bonjour,
            
              Vous avez reçu une demande de devis. Voici les détails :
            
              Utilisateur :
              - Nom d'utilisateur : ${user.username}
              - Téléphone : ${user.phone}
              - E-mail : ${user.email}
              
              Devis :`;
              
              // Ajouter les détails du devis
              let counter = 1;
              results.forEach((result) => {
                emailBody += `
                Produit ${counter} :
                - Produit : ${result.ProductName}
                - Catégorie : ${result.CategoryName}
                - Surface : ${result.surface}
                - Description : ${result.detail}`;
                
                counter++;
              });

              emailBody += `
              - Commentaire : ${results[0].Commentaire};
              Cordialement,
              Votre application de devis
              `;

              // Options de l'e-mail
              const mailOptions = {
                from: "ayoublzr1993@outlook.fr",
                to: "ayoublazaar@aol.com",
                subject: "Nouvelle demande de devis",
                text: emailBody,
              };

              // Envoi de l'e-mail
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({
                    message:
                      "Une erreur s'est produite lors de l'envoi du devis par email.",
                  });
                } else {
                  console.log("E-mail envoyé : " + info.response);
                  res.status(200).json({
                    message: "Le devis a été envoyé avec succès.",
                  });
                }
              });
            } else {
              res.status(404).json({
                message: "Le devis spécifié n'a pas été trouvé.",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message:
                "Une erreur s'est produite lors de l'exécution de la requête SQL personnalisée.",
            });
          });
      } else {
        res.status(401).json({
          message: "Utilisateur non autorisé.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Une erreur s'est produite lors de la recherche de l'utilisateur.",
      });
    });
});

// Route pour créer un devis
route.post("/api/devis", (req, res) => {
  const { UserId, commentaire } = req.body;

  db.Devis.create({ UserId, commentaire })
    .then((devis) => {
      res.status(201).json({ id: devis.id });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Une erreur est survenue lors de la création du devis.",
      });
    });
});

// Route pour créer les détails du devis
route.post("/api/devis-details", (req, res) => {
  const { surface, detail, DeviId, ProductId } = req.body;

  db.DevisDetails.create({ surface, detail, DeviId, ProductId })
    .then((devisDetails) => {
      res.status(201).json({ id: devisDetails.id });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message:
          "Une erreur est survenue lors de la création des détails du devis.",
      });
    });
});

module.exports = route;
