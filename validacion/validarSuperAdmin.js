const Administrador = require('../modelos/administradores');

const validarSuperadmin = async (req, res, next) => {
  try {
    const adminId = req.headers.adminid;
    if (!adminId) return res.status(401).json({ mensaje: 'Falta adminId en headers' });

    const admin = await Administrador.findOne({ adminId: Number(adminId) });

    if (!admin || admin.rol !== 'superadmin') {
      return res.status(403).json({ mensaje: 'Permiso denegado. Solo superadmin autorizado' });
    }

    req.superadmin = admin;
    next();
  } catch (error) {
    console.error('❌ Error autenticando superadmin:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = validarSuperadmin;
