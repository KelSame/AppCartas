const express = require('express');
const router = express.Router();
const { abrirSobreControlador } = require('../controladores/abrirSobreControlador');
const { obtenerSobresUsuario } = require('../controladores/sobresControlador');
const venderCartaControlador = require('../controladores/venderCartaControlador');
const sincronizarControl = require('../controladores/sincronizarControl');
const { comprarSobre, comprarMonedas, canjearMonedas, obtenerIntentos } = require('../controladores/comprasControlador');

router.post('/abrir-sobre', abrirSobreControlador);
router.get('/sobres/:usuarioId', obtenerSobresUsuario);

router.post('/vender-carta', venderCartaControlador.venderCarta);
router.post('/actualizar-alias', sincronizarControl.actualizarAlias);

router.post('/comprar-sobre', comprarSobre);
router.post('/comprar-monedas', comprarMonedas);
router.post('/canjear-monedas', canjearMonedas);
router.get('/intentos/:usuarioId', obtenerIntentos);

module.exports = router;
