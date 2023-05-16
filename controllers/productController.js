const db = require('../models');

// Créer un produit
exports.createProduct = (req, res, next) => {
  db.Product.create({
    name: req.body.name,
    description: req.body.description,
    image: req.file.filename,
    video: req.body.video,
    CategorieId: req.body.CategorieId,
  })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
};

// Récupérer un produit par son ID
exports.getProductById = (req, res, next) => {
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
};

// Récupérer tous les produits
exports.getAllProducts = (req, res, next) => {
  db.Product.findAll({ include: db.Categorie })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
};

// Récupérer les produits par ID de catégorie
exports.getProductsByCategoryId = (req, res, next) => {
  db.Product.findAll({
    include: [
      {
        model: db.Categorie,
        where: { id: req.params.id },
      },
    ],
  })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
};

// Mettre à jour un produit
exports.updateProduct = (req, res, next) => {
  db.Product.findByPk(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        product
          .update(req.body)
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
};

// Supprimer un produit
exports.deleteProduct = (req, res, next) => {
  db.Product.findByPk(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        product
          .destroy()
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
};