const Administrador = require('../modelos/administradores');

exports.obtenerAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.find();
    res.status(200).json({ administradores });
  } catch (error) {
    console.error('❌ Error al obtener administradores:', error);
    res.status(500).json({ error: 'Error interno al obtener administradores' });
  }
};

exports.eliminarAdministrador = async (req, res) => {
  try {
    const { adminId } = req.params;

    const adminAEliminar = await Administrador.findOne({ adminId });
    if (!adminAEliminar) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    if (!req.superadmin || req.superadmin.rol !== 'superadmin') {
      return res.status(403).json({ error: 'Permiso denegado: solo un superadmin puede eliminar administradores' });
    }

    if (req.superadmin.adminId === adminAEliminar.adminId) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }

    await Administrador.deleteOne({ adminId });
    res.status(200).json({ mensaje: '✅ Administrador eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar administrador:', error);
    res.status(500).json({ error: 'Error interno al eliminar administrador' });
  }
};

exports.crearAdministrador = async (req, res) => {
  try {
    const { usuario, correo, contrasena, rol } = req.body;

    if (!usuario || !correo || !contrasena) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    if (/^\s|\s$/.test(correo)) {
      return res.status(400).json({ error: 'El correo no debe tener espacios al inicio o al final' });
    }

    if (/\s/.test(correo)) {
      return res.status(400).json({ error: 'El correo no debe contener espacios' });
    }

    const correoLower = correo.toLowerCase();
    if (!correoLower.endsWith('@gmail.com') || !/[a-zA-Z]/.test(correoLower)) {
      return res.status(400).json({ error: 'Correo inválido. Debe contener letras y terminar en @gmail.com' });
    }

    const existente = await Administrador.findOne({
      $or: [{ usuario }, { correo }]
    });

    if (existente) {
      return res.status(409).json({ error: 'El usuario o correo ya está en uso' });
    }

    const nuevoAdmin = new Administrador({
      usuario,
      correo: correoLower,
      contrasena,
      rol: rol === 'superadmin' ? 'superadmin' : 'admin'
    });

    await nuevoAdmin.save();
    res.status(201).json({ mensaje: 'Administrador creado correctamente' });
  } catch (error) {
    console.error('❌ Error al crear administrador:', error);
    res.status(500).json({ error: 'Error interno al crear administrador' });
  }
};

exports.editarAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, correo, contrasena, rol } = req.body;

    const admin = await Administrador.findOne({ adminId: Number(id) });
    if (!admin) return res.status(404).json({ error: 'Administrador no encontrado' });

    if (usuario) admin.usuario = usuario;
    if (correo) admin.correo = correo;
    if (contrasena) admin.contrasena = contrasena; 
    if (rol && ['admin', 'superadmin'].includes(rol)) admin.rol = rol;

    await admin.save();
    res.json({ mensaje: 'Administrador actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al editar administrador:', error);
    res.status(500).json({ error: 'Error interno al editar administrador' });
  }
};
