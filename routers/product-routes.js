


const express = require('express');
const route = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

// Configuration de Multer pour gérer les téléchargements de fichiers
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'assets/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

route.post(
  '/api/addproduct',
  upload.single('image'),
  productController.createProduct
);
route.get('/api/product/:id', productController.getProductById);
route.get('/api/products', productController.getAllProducts);
route.get('/api/products/categorie/:id', productController.getProductsByCategoryId);
route.patch('/api/updateproduct/:id', productController.updateProduct);
route.delete('/api/deleteproduct/:id', productController.deleteProduct);

module.exports = route;