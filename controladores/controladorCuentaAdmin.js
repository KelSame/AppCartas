const Administrador = require('../modelos/administradores');

exports.registrarAdministrador = async (req, res) => {
  try {
    const { usuario, correo, contrasena } = req.body;

    if (!usuario || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const yaExiste = await Administrador.findOne({ correo });
    if (yaExiste) {
      return res.status(400).json({ mensaje: 'Ya existe un administrador con ese correo' });
    }

    const nuevoAdmin = await Administrador.create({
      usuario,
      correo,
      contrasena
    });

    res.status(201).json({
      mensaje: '✅ Administrador registrado correctamente',
      adminId: nuevoAdmin.adminId,
      usuario: nuevoAdmin.usuario
    });
  } catch (error) {
    console.error('❌ Error al registrar administrador:', error);
    res.status(500).json({ mensaje: 'Error interno al registrar administrador' });
  }
};

exports.loginAdministrador = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
    }

    const admin = await Administrador.findOne({
      $or: [{ usuario }, { correo: usuario }]
    });

    if (!admin) {
      return res.status(404).json({ mensaje: 'Administrador no encontrado' });
    }

    if (admin.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      mensaje: '✅ Login exitoso',
      adminId: admin.adminId,
      usuario: admin.usuario
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno al iniciar sesión' });
  }
};

exports.obtenerCuenta = async (req, res) => {
  try {
    const { adminId } = req.admin;

    const admin = await Administrador.findOne({ adminId });

    if (!admin) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.status(200).json({
      adminId: admin.adminId,
      usuario: admin.usuario,
      correo: admin.correo
    });
  } catch (error) {
    console.error('❌ Error al obtener cuenta:', error);
    res.status(500).json({ error: 'Error interno al obtener cuenta' });
  }
};

exports.editarCuenta = async (req, res) => {
  try {
    const { usuario, correo } = req.body;
    const { adminId } = req.admin;

    const admin = await Administrador.findOneAndUpdate(
      { adminId },
      { usuario, correo },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.status(200).json({ mensaje: '✅ Información actualizada correctamente', admin });
  } catch (error) {
    console.error('❌ Error al editar cuenta:', error);
    res.status(500).json({ error: 'Error interno al editar cuenta' });
  }
};

exports.cambiarContrasena = async (req, res) => {
  try {
    const { nuevaContrasena } = req.body;
    const { adminId } = req.admin;

    if (!nuevaContrasena) {
      return res.status(400).json({ error: 'Falta la nueva contraseña' });
    }

    const admin = await Administrador.findOneAndUpdate(
      { adminId },
      { contrasena: nuevaContrasena }
    );

    if (!admin) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.status(200).json({ mensaje: '✅ Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error interno al cambiar contraseña' });
  }
};

exports.eliminarCuenta = async (req, res) => {
  try {
    const { adminId } = req.admin;

    const admin = await Administrador.findOneAndDelete({ adminId });

    if (!admin) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.status(200).json({ mensaje: '✅ Cuenta eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar cuenta:', error);
    res.status(500).json({ error: 'Error interno al eliminar cuenta' });
  }
};
