const Joi =require("joi");
const db = require ('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
                        
                    })
                    .then((response) =>resolve(response) )
                    .catch((err)=>reject(err))
                })
            }
           
        }
    })
}

})
}


const privateKey = process.env.PRIVATE_KEY

exports.login=(email,password)=>{
    return new Promise((resolve, reject) =>{
        db.User.findOne({where:{email:email}}).then((user)=>{
            if(!user){
                reject('email or password not valid')
            }else{
                bcrypt.compare(password,user.password).then(same =>{
                   if(same){
                    let token=jwt.sign({id:user.id,username:user.username},privateKey,{
                        expiresIn: "24h"
                    })
                    resolve(token)
                   } else{
                    reject( 'email or password not valid')
                   }
                })
            }
           })
    })
}