const Usuario = require('../modelos/usuario');
const Carta = require('../modelos/cartasUsuarios');
const SobreUsuario = require('../modelos/sobresUsuarios');
const CartaExistente = require('../modelos/cartasExistentes');

exports.regalarMonedas = async (req, res) => {
  try {
    const { usuario, cantidad } = req.body;

    const usuarioDoc = await Usuario.findOne({
      $or: [{ usuario }, { usuarioId: Number(usuario) }]
    });

    if (!usuarioDoc) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuarioDoc.monto += Number(cantidad);
    await usuarioDoc.save();

    res.status(200).json({ mensaje: '✅ Monedas regaladas correctamente', actualizado: usuarioDoc });
  } catch (err) {
    console.error('❌ Error al regalar monedas:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.regalarSobres = async (req, res) => {
  try {
    const { usuario, calidad, cantidad } = req.body;

    const usuarioDoc = await Usuario.findOne({
      $or: [{ usuario }, { usuarioId: Number(usuario) }]
    });

    if (!usuarioDoc) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const campo = calidad === 'basico' ? 'basicos'
                : calidad === 'raro' ? 'raros'
                : calidad === 'elite' ? 'elites'
                : null;

    if (!campo) {
      return res.status(400).json({ mensaje: 'Tipo de sobre no válido' });
    }

    const actualizados = await SobreUsuario.findOneAndUpdate(
      { usuarioId: usuarioDoc.usuarioId },
      { $inc: { [campo]: Number(cantidad) } },
      { upsert: true, new: true }
    );

    res.status(200).json({ mensaje: '✅ Sobres otorgados correctamente', actualizados });
  } catch (err) {
    console.error('❌ Error al regalar sobres:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.regalarCarta = async (req, res) => {
  try {
    const { usuario, cartaId, cantidad } = req.body;

    const cartaExistente = await CartaExistente.findById(cartaId);
    if (!cartaExistente) {
      return res.status(404).json({ mensaje: 'Carta inexistente' });
    }

    const usuarioDoc = await Usuario.findOne({
      $or: [{ usuario }, { usuarioId: Number(usuario) }]
    });

    if (!usuarioDoc) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const actualizada = await Carta.findOneAndUpdate(
      {
        usuarioId: usuarioDoc.usuarioId,
        cartaId: cartaExistente._id
      },
      {
        $setOnInsert: {
          usuarioId: usuarioDoc.usuarioId,
          cartaId: cartaExistente._id,
          alias: cartaExistente.nombre,
          rareza: cartaExistente.rareza,
          tipo: cartaExistente.tipo
        },
        $inc: { cantidad: Number(cantidad) }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ mensaje: '✅ Carta otorgada correctamente', actualizada });
  } catch (err) {
    console.error('❌ Error al regalar carta:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.listarCartas = async (req, res) => {
  try {
    const { pagina = 1, busqueda = '' } = req.query;
    const limite = 8;

    const filtro = {
      nombre: { $regex: busqueda, $options: 'i' }
    };

    const cartas = await CartaExistente.find(filtro)
      .skip((pagina - 1) * limite)
      .limit(limite);

    res.status(200).json({ cartas });
  } catch (err) {
    console.error('❌ Error al listar cartas:', err);
    res.status(500).json({ mensaje: 'Error al cargar cartas' });
  }
};
