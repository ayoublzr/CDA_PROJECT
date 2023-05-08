





const express = require('express');
const route = express.Router();
const devisController = require('../controllers/devisController');

route.post('/api/devis', devisController.createDevis);

module.exports = route;