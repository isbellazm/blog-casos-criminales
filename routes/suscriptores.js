const express = require("express");
const router = express.Router();
const suscriptoresController = require("../controllers/suscriptoresController");
const soloAdmin = require("../utils/soloAdmin");

router.post("/", suscriptoresController.suscribir);
router.get("/", soloAdmin, suscriptoresController.listarSuscriptores);
router.get("/baja", suscriptoresController.darDeBaja);

module.exports = router;
