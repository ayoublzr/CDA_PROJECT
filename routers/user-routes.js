const express = require('express')
const route = express.Router()
const db = require ('../models')


const userController= require('../controllers/userController')


route.post('/api/register',(req, res, next) => {

    userController.register(req.body.username,req.body.email,req.body.phone,req.body.password,req.body.repeatPassword)
    .then(response => res.status(200).json(response))
    .catch(err=>res.status(400).json(err))

})
 


route.post('/api/login',(req, res, next) => {

   
    userController.login(req.body.email, req.body.password)
    .then(token => res.status(200).json({token:token}))
    .catch(err=>res.status(400).json(err))



  

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