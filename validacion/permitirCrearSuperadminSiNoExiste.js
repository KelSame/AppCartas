const Administrador = require('../modelos/administradores');

const permitirCrearSuperadminSiNoExiste = async (req, res, next) => {
  try {
    const existeSuperadmin = await Administrador.exists({ rol: 'superadmin' });

    if (!existeSuperadmin) {
      return next();
    }

    const adminId = req.headers.adminid;
    if (!adminId) return res.status(401).json({ mensaje: 'Falta adminId en headers' });

    const admin = await Administrador.findOne({ adminId: Number(adminId) });

    if (!admin || admin.rol !== 'superadmin') {
      return res.status(403).json({ mensaje: 'Permiso denegado. Solo superadmin autorizado' });
    }

    req.superadmin = admin;
    next();
  } catch (error) {
    console.error('❌ Error en validación superadmin:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = permitirCrearSuperadminSiNoExiste;
