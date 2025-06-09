const express = require('express');
const router = express.Router();
const { autenticarAdmin } = require('../validacion/validarAdmin');
const cartas = require('../controladores/controladorCartasExistentes');
const tipos = require('../controladores/controladorTipos');
const sobres = require('../controladores/controladorSobresCalidades');

router.post('/crear-carta', autenticarAdmin, cartas.crearCarta);
router.get('/cartas', autenticarAdmin, cartas.obtenerCartas);
router.post('/eliminar-cartas', autenticarAdmin, cartas.eliminarCartas);
router.put('/editar-carta/:id', autenticarAdmin, cartas.modificarCarta);

router.post('/crear-tipo', autenticarAdmin, tipos.crearTipo);
router.get('/tipos', autenticarAdmin, tipos.obtenerTipos);
router.post('/eliminar-tipos', autenticarAdmin, tipos.eliminarTipos);
router.put('/editar-tipo/:id', autenticarAdmin, tipos.modificarTipo);

router.get('/rareza', autenticarAdmin, sobres.obtenerRarezas);

module.exports = router;
