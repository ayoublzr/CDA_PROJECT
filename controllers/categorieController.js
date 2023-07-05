const db = require('../models')

// Créer une catégorie
exports.createCategorie = (req, res, next) => {
  db.Categorie.create({ name: req.body.name }) // Utiliser req.body.name pour récupérer le nom
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err))
}

// Récupérer une catégorie par son ID
exports.getCategorieById = (req, res, next) => {
  db.Categorie.findByPk(req.params.id)
    .then((categorie) => {
      if (!categorie) {
        res.status(404).json({ message: 'Categorie not found' })
      } else {
        res.json(categorie)
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    })
}

// Récupérer toutes les catégories
exports.getAllCategories = (req, res, next) => {
  db.Categorie.findAll()
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err))
}

// Mettre à jour une catégorie
exports.updateCategorie = (req, res, next) => {
  db.Categorie.findByPk(req.params.id)
    .then((categorie) => {
      if (!categorie) {
        res.status(404).json({ message: 'Categorie not found' })
      } else {
        categorie
          .update(req.body)
          .then((updatedCategorie) => {
            res.json(updatedCategorie)
          })
          .catch((error) => {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
          })
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    })
}

// Supprimer une catégorie
exports.deleteCategorie = (req, res, next) => {
  db.Categorie.findByPk(req.params.id)
    .then((categorie) => {
      if (!categorie) {
        res.status(404).json({ message: 'Categorie not found' })
      } else {
        categorie
          .destroy()
          .then(() => {
            res.json({ message: 'Categorie deleted successfully' })
          })
          .catch((error) => {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
          })
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    })
}
