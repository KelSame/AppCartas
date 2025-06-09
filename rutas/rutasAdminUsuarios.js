const express = require('express');
const router = express.Router();
const { autenticarAdmin } = require('../validacion/validarAdmin');
const usuarios = require('../controladores/controladorUsuariosAdmin');
const admins = require('../controladores/controladorAdministradores');

router.get('/usuarios', autenticarAdmin, usuarios.obtenerUsuarios);
router.delete('/usuario/:id', autenticarAdmin, usuarios.eliminarUsuario);

router.get('/administradores', autenticarAdmin, admins.obtenerAdministradores);
router.delete('/administrador/:adminId', autenticarAdmin, admins.eliminarAdministrador);

module.exports = router;
