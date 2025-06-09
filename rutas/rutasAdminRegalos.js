const express = require('express');
const router = express.Router();
const { autenticarAdmin } = require('../validacion/validarAdmin');
const controlador = require('../controladores/controladorRegalos');

router.post('/monedas', autenticarAdmin, controlador.regalarMonedas);
router.post('/sobres', autenticarAdmin, controlador.regalarSobres);
router.post('/cartas', autenticarAdmin, controlador.regalarCarta);

module.exports = router;
