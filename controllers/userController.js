const Joi =require("joi");
const db = require ('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail } = require("../nodemailer/verifyEmail");
require('dotenv').config();

const schemaValidation =Joi.object({
    username: Joi.string().required(),
    email:Joi.string().email().required(),
    phone:Joi.number().required(),
    password: Joi.string().min(8).required(),
    repeatPassword: Joi.ref('password'),
    
})


exports.register=(username, email, phone, password, repeatPassword) => {
return new Promise((resolve, reject) => {
  //methode pour crée une chaine de caractère aleatoire 
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
let activationCode = ""
for (let i=0 ; i<25 ; i++) {
  activationCode += characters[Math.floor(Math.random() * characters.length)]
}

let validation= schemaValidation.validate({username, email, phone, password, repeatPassword})
if (validation.error){
    reject(validation.error.details[0].message)
}else{
    db.User.count({where:{email:email}}).then((doc)=>{
        if(doc!=0){
           reject("this email is already used") 
    
        }else{
            if (password !== repeatPassword) {
                reject("Passwords do not match");
                
            }else{
                bcrypt.hash(password, 10).then(hashedPassword=>{
                    db.User.create({
                        username: username,
                        email: email,
                        phone:phone,
                        password:hashedPassword,
                        activationCode:activationCode,
                        
                    })
                    .then((response) => {
                      sendConfirmationEmail(email, activationCode); // Appel à la méthode sendConfirmationEmail ici
                      resolve(response);
                    })
                    .catch((err)=>reject(err))
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

              // Update the token in the database
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
  console.log("Activation code:", req.params.activationcode);

  db.User.findOne({ where: { activationCode: req.params.activationcode } })
    .then(user => {
      if (!user) {
        console.log("User not found");
        res.send({
          message: "Ce code d'activation est faux"
        });
      } else {
        console.log("User found:", user);

        user.update({ isActive: true })
          .then(() => {
            console.log("Account activated");
            res.send({
              message: "Le compte a été activé avec succès"
            });
          })
          .catch(error => {
            console.log("Error updating user:", error);
            res.status(500).send({
              message: "Une erreur s'est produite lors de l'activation du compte"
            });
          });
      }
    })
    .catch(error => {
      console.log("Error finding user:", error);
      res.status(500).send({
        message: "Une erreur s'est produite lors de la vérification du code d'activation"
      });
    });
};
exports.newPassword = (password, repeatPassword, activationcode) => {
  console.log(activationcode)
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { activationCode: activationcode } })
      .then(user => {
        if (!user) {
          reject("User not found");
        } else {
          if (password !== repeatPassword) {
            reject("Passwords do not match");
          } else {
            bcrypt.hash(password, 10).then(hashedPassword => {
              console.log(hashedPassword)
              
              db.User.update({
                password: hashedPassword,
              }, {
                where: { activationCode: activationcode } 
              })
              
                .then((response) => {
                  resolve(response);
                })
                .catch((err) => reject(err));
            });
          }
        }
      })
      .catch((err) => reject(err));
  });
};




