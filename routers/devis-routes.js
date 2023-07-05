

const express = require("express")
const route = express.Router()
const devisController = require("../controllers/devisController")

route.post("/api/sendDevis", devisController.sendDevis)
route.post("/api/devis", devisController.createDevis)
route.post("/api/devis-details", devisController.createDevisDetails)
route.get("/api/devis-list", devisController.getDevisList)
route.delete("/api/deletedevis/:id", devisController.deleteDevis)

module.exports = route