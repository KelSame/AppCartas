const express = require('express');
const router = express.Router();
const { autenticarAdmin } = require('../validacion/validarAdmin');
const sobres = require('../controladores/controladorSobresCalidades');

router.post('/crear', autenticarAdmin, sobres.crearSobre);
router.get('/todos', autenticarAdmin, sobres.obtenerSobres);
router.post('/eliminar', autenticarAdmin, sobres.eliminarSobres);
router.put('/editar/:id', autenticarAdmin, sobres.modificarSobre);

module.exports = router;
