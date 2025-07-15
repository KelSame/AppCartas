const SobreUsuario = require('../modelos/sobresUsuarios');
const SobreCalidad = require('../modelos/sobresCalidades');

// Función para limpiar texto (quita "Sobre", tildes, minúsculas)
const limpiarRareza = (texto) => {
  return texto
    .replace(/^Sobre\s+/i, '') // Quitar prefijo "Sobre "
    .normalize('NFD')          // Descomponer caracteres con tilde
    .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
    .toLowerCase();            // Convertir a minúsculas
};

const obtenerSobresUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId || isNaN(Number(usuarioId))) {
      return res.status(400).json({ mensaje: 'ID de usuario inválido' });
    }

    const sobresUsuario = await SobreUsuario.findOne({ usuarioId: Number(usuarioId) });
    if (!sobresUsuario) {
      return res.status(404).json({ mensaje: 'Usuario sin sobres asignados' });
    }

    const sobresCalidades = await SobreCalidad.find();

    const buscarImagen = (tipo) => {
      const match = sobresCalidades.find((s) => limpiarRareza(s.rareza) === tipo);
      return match?.imagen || '';
    };

    const resultado = [
      {
        tipo: 'basico',
        imagen: buscarImagen('basico'),
        cantidad: sobresUsuario.basicos || 0,
      },
      {
        tipo: 'raro',
        imagen: buscarImagen('raro'),
        cantidad: sobresUsuario.raros || 0,
      },
      {
        tipo: 'elite',
        imagen: buscarImagen('elite'),
        cantidad: sobresUsuario.elites || 0,
      },
    ];

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('❌ Error al obtener sobres del usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { obtenerSobresUsuario };
