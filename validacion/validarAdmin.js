const Usuario = require('../modelos/usuario');

const validarAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({ error: 'Falta el adminId' });
    }

    const admin = await Usuario.findOne({ usuarioId: adminId });

    if (!admin || admin.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
    }

    next();
  } catch (error) {
    console.error('❌ Error al validar administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = validarAdmin;
