const Usuario = require('../modelos/usuario');
const Carta = require('../modelos/cartasUsuarios');
const SobreUsuario = require('../modelos/sobresUsuarios');
const validarAdmin = require('../validacion/validarAdmin');
const CartaExistente = require('../modelos/cartasExistentes');

exports.regalarSobres = async (req, res) => {
  try {
    const { adminId, usuarioId, calidad, cantidad } = req.body;
    if (!await validarAdmin(adminId)) return res.status(403).json({ mensaje: 'Acceso denegado' });

    const actualizados = await SobreUsuario.findOneAndUpdate(
      { usuarioId },
      { $inc: { [`cantidad.${calidad}`]: cantidad } },
      { upsert: true, new: true }
    );

    res.status(200).json({ mensaje: 'Sobres otorgados correctamente', actualizados });
  } catch (err) {
    console.error('❌ Error al regalar sobres:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.regalarMonedas = async (req, res) => {
  try {
    const { adminId, usuarioId, monto } = req.body;
    if (!await validarAdmin(adminId)) return res.status(403).json({ mensaje: 'Acceso denegado' });

    const actualizado = await Usuario.findOneAndUpdate(
      { usuarioId },
      { $inc: { monto } },
      { new: true }
    );

    res.status(200).json({ mensaje: 'Monedas regaladas correctamente', actualizado });
  } catch (err) {
    console.error('❌ Error al regalar monedas:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.regalarCarta = async (req, res) => {
  try {
    const { adminId, usuarioId, cartaId, cantidad } = req.body;
    if (!await validarAdmin(adminId)) return res.status(403).json({ mensaje: 'Acceso denegado' });

    const cartaExistente = await CartaExistente.findById(cartaId);
    if (!cartaExistente) return res.status(404).json({ mensaje: 'Carta inexistente' });

    const actualizada = await Carta.findOneAndUpdate(
      { usuarioId, nombre: cartaExistente.nombre },
      {
        $setOnInsert: {
          alias: cartaExistente.nombre,
          rareza: cartaExistente.rareza,
          tipo: cartaExistente.tipo,
        },
        $inc: { cantidad },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ mensaje: 'Carta otorgada correctamente', actualizada });
  } catch (err) {
    console.error('❌ Error al regalar carta:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
