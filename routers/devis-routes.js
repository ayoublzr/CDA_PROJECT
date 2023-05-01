const express = require('express')
const route = express.Router()
const db = require ('../models')
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('express-jwt');





route.post('/api/devis', jwtMiddleware({ secret: 'your-secret-key' }),(req,res,next) => {
    db.Devis.create({
        categorie: req.body.categorie,
        product: req.body.product,
        surface: req.body.surface,
        description:req.body.description
    })
    .then((response) =>res.status(200).send(response) )
    .catch((err)=>res.status(400).send(err))
})

module.exports = route