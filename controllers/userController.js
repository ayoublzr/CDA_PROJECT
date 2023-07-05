const Joi = require("joi")
const db = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { sendConfirmationEmail } = require("../nodemailer/verifyEmail")
require('dotenv').config()

const schemaValidation = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  password: Joi.string().min(8).required(),
  repeatPassword: Joi.ref("password"),
})

exports.register = (username, email, phone, password, repeatPassword) => {
  return new Promise((resolve, reject) => {
    const activationCode = Math.floor(Date.now() / 1000).toString()

    let validation = schemaValidation.validate({
      username,
      email,
      phone,
      password,
      repeatPassword,
    })
    if (validation.error) {
      reject(validation.error.details[0].message)
    } else {
      db.User.count({ where: { email: email } }).then((doc) => {
        if (doc != 0) {
          reject("This email is already used")
        } else {
          if (password !== repeatPassword) {
            reject("Passwords do not match")
          } else {
            bcrypt.hash(password, 10).then((hashedPassword) => {
              db.User.create({
                username: username,
                email: email,
                phone: phone,
                password: hashedPassword,
                activationCode: activationCode,
              })
                .then((response) => {
                  sendConfirmationEmail(email, activationCode)
                  resolve(response)
                })
                .catch((err) => reject(err))
            })
          }
        }
      })
    }
  })
}

const privateKey = process.env.PRIVATE_KEY;

exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { email: email } }).then((user) => {
      if (!user) {
        reject("email or password not valid");
      } else {
        if (!user.isActive) {
          reject("Veuillez activer votre compte en accédant à votre e-mail.");
        } else {
          bcrypt.compare(password, user.password).then((same) => {
            if (same) {
              let token = jwt.sign(
                { id: user.id, username: user.username },
                privateKey,
                {
                  expiresIn: "24h",
                }
              );

              user.update({ token: token }).then(() => {
                resolve(token);
              });
            } else {
              reject("email or password not valid");
            }
          });
        }
      }
    });
  });
};
exports.loginDesktop = (email, password) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { email: email } }).then((user) => {
      if (!user) {
        reject("email or password not valid");
      } else {
        if (!user.isActive) {
          reject("Veuillez activer votre compte en accédant à votre e-mail.");
        } else if (!user.isAdmin) {  // Nouvelle condition pour vérifier si l'utilisateur est un administrateur
          reject("Vous n'avez pas les autorisations nécessaires pour vous connecter.");
        } else {
          bcrypt.compare(password, user.password).then((same) => {
            if (same) {
              let token = jwt.sign(
                { id: user.id, username: user.username },
                privateKey,
                {
                  expiresIn: "24h",
                }
              );

              user.update({ token: token }).then(() => {
                resolve(token);
              });
            } else {
              reject("email or password not valid");
            }
          });
        }
      }
    });
  });
};

exports.verifyUser = (req, res) => {
  db.User.findOne({ where: { activationCode: req.params.activationcode } })
    .then((user) => {
      if (!user) {
        res.send({
          message: "Ce code d'activation est faux",
        })
      } else {
        console.log("User found:", user)

        user
          .update({ isActive: true })
          .then(() => {
            res.send({
              message: "Le compte a été activé avec succès",
            })
          })
          .catch((error) => {
            console.log("Error updating user:", error)
            res.status(500).send({
              message:
                "Une erreur s'est produite lors de l'activation du compte",
            })
          })
      }
    })
    .catch((error) => {
      console.log("Error finding user:", error)
      res.status(500).send({
        message:
          "Une erreur s'est produite lors de la vérification du code d'activation",
      })
    })
}
exports.updateRole = (req, res) => {
  db.User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: "L'utilisateur n'existe pas.",
        });
      } else {
        console.log("User found:", user);

        user
          .update({ isAdmin: !user.isAdmin }) // Utiliser user.isAdmin pour déterminer le rôle actuel de l'utilisateur
          .then(() => {
            res.send({
              message: "Le rôle a été modifié avec succès.",
            });
          })
          .catch((error) => {
            console.log("Error updating user:", error);
            res.status(500).send({
              message: "Une erreur s'est produite lors de la modification du rôle.",
            });
          });
      }
    })
    .catch((error) => {
      console.log("Error finding user:", error);
      res.status(500).send({
        message: "Une erreur s'est produite lors de la recherche de l'utilisateur.",
      });
    });
};

exports.newPassword = (password, repeatPassword, activationcode) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { activationCode: activationcode } })
      .then((user) => {
        if (!user) {
          reject("User not found")
        } else {
          if (password !== repeatPassword) {
            reject("Passwords do not match")
          } else {
            bcrypt.hash(password, 10).then((hashedPassword) => {
              db.User.update(
                {
                  password: hashedPassword,
                },
                {
                  where: { activationCode: activationcode },
                }
              )

                .then((response) => {
                  resolve(response)
                })
                .catch((err) => reject(err))
            })
          }
        }
      })
      .catch((err) => reject(err))
  })
}
