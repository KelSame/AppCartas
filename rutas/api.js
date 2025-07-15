const express = require('express');
const router = express.Router();

const {
  sincronizarDatos,
  obtenerDatos,
  eliminarUsuario,
  actualizarUsuario
} = require('../controladores/sincronizarControl');

const {
  registrarUsuario,
  loginUsuario
} = require('../controladores/controladorUsuario');

const { abrirSobreControlador } = require('../controladores/abrirSobreControlador');

router.post('/sync', sincronizarDatos);
router.get('/download', obtenerDatos);
router.delete('/deleteUser', eliminarUsuario);
router.put('/updateUser', actualizarUsuario);

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

router.post('/abrir-sobre', abrirSobreControlador);

module.exports = router;
