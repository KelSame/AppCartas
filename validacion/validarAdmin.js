const Administrador = require('../modelos/administradores');
exports.autenticarAdmin = async (req, res, next) => {
  const adminId = req.headers['adminid'];

  if (!adminId) {
    return res.status(401).json({ error: 'adminId requerido en headers' });
  }

  try {
    const admin = await Administrador.findOne({ adminId: Number(adminId) });

    if (!admin) {
      return res.status(403).json({ error: 'Acceso denegado: administrador no encontrado' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('❌ Error en autenticarAdmin:', error);
    res.status(500).json({ error: 'Error al verificar administrador' });
  }
};
