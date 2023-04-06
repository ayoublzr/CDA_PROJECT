const express = require('express')
const route = express.Router()
const db = require ('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


route.post('/api/register',(req, res, next) => {

    db.User.count({where:{email:req.body.email}}).then((doc)=>{
        if(doc!=0){
           res.status(400).send("this email is already used") 

        }else{
            bcrypt.hash(req.body.password, 10).then(hashedPassword=>{
                db.User.create({
                    username: req.body.username,
                    email: req.body.email,
                    phone:req.body.phone,
                    password:hashedPassword
                })
                .then((response) =>res.status(200).send(response) )
                .catch((err)=>res.status(400).send(err))
            })
        }
    })



  

})
 

const PrivateKey ="my private key kjgnjghf:nlgnjlmjngmntghkb"
route.post('/api/login',(req, res, next) => {

   db.User.findOne({where:{email:req.body.email}}).then((user)=>{
    if(!user){
        res.status(400).json({error: 'email or password not valid'})
    }else{
        bcrypt.compare(req.body.password,user.password).then(same =>{
           if(same){
            let token=jwt.sign({id:user.id,username:user.username},PrivateKey,{
                expiresIn: "24h"
            })
            res.status(200).json({token:token})
           } else{
            res.status(400).json({error: 'email or password not valid'})
           }
        })
    }
   })
    



  

})


route.get('/api/user/:id',(req, res, next) => {
    db.User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(user);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});
  


route.get('/api/users',(req, res, next)=>{
    db.User.findAll()
    .then((response) =>res.status(200).send(response) )
    .catch((err)=>res.status(400).send(err))
})

route.patch('/api/updateuser/:id',(req, res, next)=>{
    db.User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        user.update(req.body)
          .then((updatedUser) => {
            res.json(updatedUser);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
})



route.delete('/api/deleteuser/:id',(req, res, next) => {
    db.User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        user.destroy()
          .then(() => {
            res.json({ message: 'User deleted successfully' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
})



module.exports = route