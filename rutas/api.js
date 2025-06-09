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

router.post('/sync', sincronizarDatos);
router.get('/download', obtenerDatos);
router.delete('/deleteUser', eliminarUsuario);
router.put('/updateUser', actualizarUsuario);

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

module.exports = router;
