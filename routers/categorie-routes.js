




const express = require('express');
const route = express.Router();
const categorieController = require('../controllers/categorieController');

route.post('/api/addcategorie', categorieController.createCategorie);
route.get('/api/categorie/:id', categorieController.getCategorieById);
route.get('/api/categories', categorieController.getAllCategories);
route.patch('/api/updatecategorie/:id', categorieController.updateCategorie);
route.delete('/api/deletecategorie/:id', categorieController.deleteCategorie);

module.exports = route;






