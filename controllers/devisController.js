// const db = require('../models');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

// const privateKey = process.env.PRIVATE_KEY;
// const transporter = nodemailer.createTransport({
//     host: 'smtp-mail.outlook.com',
//     port: 587,
//     secure: false, //  true si votre serveur SMTP nécessite une connexion sécurisée (SSL/TLS)
//     auth: {
//       user: 'ayoublzr1993@outlook.fr', // Adresse e-mail de l'expéditeur
//       pass: 'Motdepasse06' // Mot de passe de l'expéditeur
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
// });

// function createDevis(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const token = authHeader.split(' ')[1];
//   console.log(token);

//   jwt.verify(token, privateKey, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     } else {
//       const userId = decoded.id;

//       // Récupérer l'utilisateur à partir de la base de données
//       db.User.findByPk(userId)
//         .then((user) => {
//           if (user && user.token === token) {
//             // Le token correspond à l'utilisateur
//             db.Devis.create({
//               categorie: req.body.categorie,
//               product: req.body.product,
//               surface: req.body.surface,
//               description: req.body.description,
//               UserId: userId
//             })
//               .then((devis) => {
//                 // Envoyer un e-mail à l'administrateur avec les informations de la demande de devis et les informations de l'utilisateur
//                 const adminEmail = 'ayoublazaar@aol.com'; // Adresse e-mail de l'administrateur
//                 const subject = 'Nouvelle demande de devis';
//                 const text = `Une nouvelle demande de devis a été soumise.\n\n
//                   Informations de l'utilisateur :\n
//                   Nom d'utilisateur : ${user.username}\n
//                   Email : ${user.email}\n
//                   Téléphone : ${user.phone}\n\n
//                   Informations de la demande de devis :\n
//                   Catégorie : ${req.body.categorie}\n
//                   Produit : ${req.body.product}\n
//                   Surface : ${req.body.surface}m2\n
//                   Description : ${req.body.description}`;

//                 transporter.sendMail(
//                   {
//                     from: 'ayoublzr1993@outlook.fr',
//                     to: adminEmail,
//                     subject: subject,
//                     text: text,
//                   },
//                   (error, info) => {
//                     if (error) {
//                       console.log("Erreur lors de l'envoi de l'e-mail:", error);
//                     } else {
//                       console.log('E-mail envoyé:', info.response);
//                     }
//                   }
//                 );

//                 res.status(200).json({ message: 'Demande de devis soumise avec succès.' });
//               })
//               .catch((err) => {
//                 console.log('Erreur lors de la création de la demande de devis:', err);
//                 res.status(500).json({ message: 'Erreur lors de la création de la demande de devis.' });
//               });
//           } else {
//             return res.status(401).json({ message: 'Unauthorized' });
//           }
//         })
//         .catch((err) => {
//           console.log("Erreur lors de la récupération des informations de l'utilisateur:", err);
//           res.status(500).json({ message: "Erreur lors de la récupération des informations de l'utilisateur." });
//         });
//     }
//   });
// }

// module.exports = {
//   createDevis,
// };

// const db = require("../models");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");

// const privateKey = process.env.PRIVATE_KEY;
// const transporter = nodemailer.createTransport({
//   host: "smtp-mail.outlook.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "ayoublzr1993@outlook.fr",
//     pass: "Motdepasse06",
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// async function createDevis(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];
//   console.log(token);

//   jwt.verify(token, privateKey, async (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Unauthorized" });
//     } else {
//       const userId = decoded.id;

//       try {
//         const user = await db.User.findByPk(userId);
//         if (user && user.token === token) {
//           // Le token correspond à l'utilisateur
//           const products = req.body.products; // Array contenant les produits pour lesquels vous souhaitez demander un devis

//           const devisPromises = products.map(async (product) => {
//             const devis = await db.Devis.create({
//               categorie: req.body.categorie,
//               product: req.body.product,
//               surface: req.body.surface,
//               description: req.body.description,
//               UserId: userId,
//             });

//             return devis;
//           });

//           const devisResults = await Promise.all(devisPromises);

//           // Envoyer un e-mail à l'administrateur avec les informations de la demande de devis et les informations de l'utilisateur
//           const adminEmail = "ayoublazaar@aol.com"; // Adresse e-mail de l'administrateur
//           const subject = "Nouvelle demande de devis";
//           let text = `Une nouvelle demande de devis a été soumise.\n\n
//             Informations de l'utilisateur :\n
//             Nom d'utilisateur : ${user.username}\n
//             Email : ${user.email}\n
//             Téléphone : ${user.phone}\n\n`;

//           devisResults.forEach((devis, index) => {
//             text += `Informations de la demande de devis ${index + 1} :\n
//               Catégorie : ${devis.categorie}\n
//               Produit : ${devis.product}\n
//               Surface : ${devis.surface}m2\n
//               Description : ${devis.description}\n\n`;
//           });

//           transporter.sendMail(
//             {
//               from: "ayoublzr1993@outlook.fr",
//               to: adminEmail,
//               subject: subject,
//               text: text,
//             },
//             (error, info) => {
//               if (error) {
//                 console.log("Erreur lors de l'envoi de l'e-mail:", error);
//               } else {
//                 console.log("E-mail envoyé:", info.response);
//               }
//             }
//           );

//           res
//             .status(200)
//             .json({ message: "Demande de devis soumise avec succès." });
//         } else {
//           return res.status(401).json({ message: "Unauthorized" });
//         }
//       } catch (err) {
//         console.log("Erreur lors de la création de la demande de devis:", err);
//         res
//           .status(500)
//           .json({
//             message: "Erreur lors de la création de la demande de devis.",
//           });
//       }
//     }
//   });
// }

// module.exports = {
//   createDevis,
// };
