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
    const admin = await Administrador.findOneAndDelete({ adminId });

    if (!admin) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.status(200).json({ mensaje: '✅ Administrador eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar administrador:', error);
    res.status(500).json({ error: 'Error interno al eliminar administrador' });
  }
};
