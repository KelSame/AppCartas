const Usuario = require('../modelos/usuario');
const CartaUsuario = require('../modelos/cartasUsuarios');
const CartaExistente = require('../modelos/cartasExistentes');

const preciosPorRareza = {
  común: 5,
  raro: 10,
  épico: 20,
  legendario: 50,
};

exports.venderCarta = async (req, res) => {
  try {
    const { usuarioId, cartaId } = req.body;

    if (!usuarioId || !cartaId) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
    }

    const cartaUsuario = await CartaUsuario.findOne({ usuarioId, cartaId });
    if (!cartaUsuario || cartaUsuario.cantidad < 1) {
      return res.status(400).json({ mensaje: 'No tienes esa carta o no hay unidades disponibles.' });
    }

    const cartaBase = await CartaExistente.findById(cartaId);
    if (!cartaBase) {
      return res.status(404).json({ mensaje: 'Carta inexistente.' });
    }

    const precio = preciosPorRareza[cartaBase.rareza];
    if (!precio) {
      return res.status(400).json({ mensaje: 'Rareza inválida para calcular precio.' });
    }

    // Actualizar cantidad de la carta
    if (cartaUsuario.cantidad > 1) {
      cartaUsuario.cantidad -= 1;
      await cartaUsuario.save();
    } else {
      await cartaUsuario.deleteOne();
    }

    // Aumentar monedas del usuario
    const usuario = await Usuario.findOne({ usuarioId });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    usuario.monto = (usuario.monto || 0) + precio;
    await usuario.save();

    return res.json({
      mensaje: 'Carta vendida exitosamente.',
      nuevaCantidad: cartaUsuario.cantidad || 0,
      montoActualizado: usuario.monto,
    });

  } catch (error) {
    console.error('❌ Error al vender carta:', error);
    res.status(500).json({ mensaje: 'Error del servidor al vender la carta.' });
  }
};
