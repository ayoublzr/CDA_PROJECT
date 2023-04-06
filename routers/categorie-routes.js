



const express = require('express')
const route = express.Router()
const db = require ('../models')


route.post('/api/addcategorie',(req, res, next) => {

    db.Categorie.create(req.body)
    .then((response) =>res.status(200).send(response) )
    .catch((err)=>res.status(400).send(err))

})


route.get('/api/categorie/:id',(req, res, next) => {
    db.Categorie.findByPk(req.params.id)
    .then((categorie) => {
      if (!categorie) {
        res.status(404).json({ message: 'Categorie not found' });
      } else {
        res.json(categorie);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});
  


route.get('/api/categories',(req, res, next)=>{
    db.Categorie.findAll()
    .then((response) =>res.status(200).send(response) )
    .catch((err)=>res.status(400).send(err))
})

route.patch('/api/updatecategorie/:id',(req, res, next)=>{
    db.Categorie.findByPk(req.params.id)
    .then((categorie) => {
      if (!categorie) {
        res.status(404).json({ message: 'Categorie not found' });
      } else {
        categorie.update(req.body)
          .then((updatedCategorie) => {
            res.json(updatedCategorie);
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


route.delete('/api/deletecategorie/:id',(req, res, next) => {
    db.Categorie.findByPk(req.params.id)
    .then((categorie) => {
      if (!categorie) {
        res.status(404).json({ message: 'Categorie not found' });
      } else {
        categorie.destroy()
          .then(() => {
            res.json({ message: 'Categorie deleted successfully' });
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