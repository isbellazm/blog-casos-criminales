const express = require("express");
const router = express.Router();
const entradasController = require("../controllers/entradasController");
const soloAdmin = require("../utils/soloAdmin");

router.get("/", entradasController.listarEntradas);
router.post("/", soloAdmin, entradasController.publicarEntrada);

module.exports = router;
