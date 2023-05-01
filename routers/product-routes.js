const express = require('express')
const route = express.Router()
const db = require ('../models')
const multer = require ('multer')



route.post('/api/addproduct', multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'assets/uploads')
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
}).single('image'), (req, res, next) => {
  db.Product.create({
      name: req.body.name,
      description: req.body.description,
      image: req.file.filename, // Utilisation de req.file.filename pour enregistrer le nom du fichier enregistré
      video: req.body.video,
      CategorieId: req.body.CategorieId
    })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err))
})


route.get('/api/product/:id',(req, res, next) => {
    
    db.Product.findByPk(req.params.id, { include: db.Categorie })
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.json(product);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});



route.get('/api/products',(req, res, next)=>{
    db.Product.findAll({ include: db.Categorie })
    .then((response) =>res.status(200).send(response) )
    .catch((err)=>res.status(400).send(err))
})

route.get('/api/products/categorie/:id', (req, res, next) => {
  db.Product.findAll({  
    include: [{
      model: db.Categorie,
      where: { id: req.params.id }
    }] 
  })
  .then((response) => res.status(200).send(response))
  .catch((err) => res.status(400).send(err))
})

route.patch('/api/updateproduct/:id',(req, res, next)=>{
    db.Product.findByPk(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        product.update(req.body)
          .then((updatedProduct) => {
            res.json(updatedProduct);
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
});

route.delete('/api/deleteproduct/:id',(req, res, next) => {
    db.Product.findByPk(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        product.destroy()
          .then(() => {
            res.json({ message: 'Product deleted successfully' });
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