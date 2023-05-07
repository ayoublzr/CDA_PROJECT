const express = require('express');
const route = express.Router();
const db = require ('../models');
const jwt = require('jsonwebtoken');





  const privateKey = process.env.PRIVATE_KEY;

  route.post('/api/devis', (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        const userId = decoded.id;
        db.Devis.create({
          categorie: req.body.categorie,
          product: req.body.product,
          surface: req.body.surface,
          description: req.body.description,
          UserId: userId
        })
        .then(response => res.status(200).send(response))
        .catch(err => res.status(400).send(err));
      }
    });
  });
  

module.exports = route