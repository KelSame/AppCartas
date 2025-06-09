const express = require('express');
const router = express.Router();
const { autenticarAdmin } = require('../validacion/validarAdmin');
const cuenta = require('../controladores/controladorCuentaAdmin');
router.post('/registro', cuenta.registrarAdministrador);
router.post('/login', cuenta.loginAdministrador);
router.get('/', autenticarAdmin, cuenta.obtenerCuenta);
router.put('/editar', autenticarAdmin, cuenta.editarCuenta);
router.put('/contrasena', autenticarAdmin, cuenta.cambiarContrasena);
router.delete('/eliminar', autenticarAdmin, cuenta.eliminarCuenta);

module.exports = router;
