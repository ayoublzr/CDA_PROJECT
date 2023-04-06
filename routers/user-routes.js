const express = require('express')
const route = express.Router()
const db = require ('../models')


route.post('/api/createuser',(req, res, next) => {

    db.User.create(req.body)
    .then((response) =>res.status(200).send(response) )
    .catch((err)=>res.status(400).send(err))

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