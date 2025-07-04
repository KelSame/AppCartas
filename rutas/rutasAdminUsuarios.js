const express = require('express');
const router = express.Router();
const { autenticarAdmin } = require('../validacion/validarAdmin');
const usuarios = require('../controladores/controladorUsuariosAdmin');
const admins = require('../controladores/controladorAdministradores');
const Administrador = require('../modelos/administradores');
const permitirCrearSuperadminSiNoExiste = require('../validacion/permitirCrearSuperadminSiNoExiste');
const validarSuperadmin = require('../validacion/validarSuperAdmin');

router.get('/usuarios', autenticarAdmin, usuarios.obtenerUsuarios);
router.delete('/usuario/:id', autenticarAdmin, usuarios.eliminarUsuario);

router.get('/administradores', autenticarAdmin, admins.obtenerAdministradores);
router.delete('/administrador/:adminId', validarSuperadmin, admins.eliminarAdministrador);

router.get('/superadmin-existe', async (req, res) => {
  try {
    const existe = await Administrador.exists({ rol: 'superadmin' });
    res.json({ existe: !!existe });
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar superadmin' });
  }
});
router.post('/crear', permitirCrearSuperadminSiNoExiste, admins.crearAdministrador);
router.put('/administrador/:id', validarSuperadmin, admins.editarAdministrador);

module.exports = router;
