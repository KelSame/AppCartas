const CartaExistente = require('../modelos/cartasExistentes');

exports.crearCarta = async (req, res) => {
  try {
    const { nombre, rareza, tipos, imagen, descripcion } = req.body;

    if (!nombre || !rareza || !tipos || !imagen || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const yaExiste = await CartaExistente.findOne({ nombre });
    if (yaExiste) {
      return res.status(400).json({ error: 'Ya existe una carta con ese nombre' });
    }

    const carta = await CartaExistente.create({ nombre, rareza, tipos, imagen, descripcion });
    res.status(201).json({ mensaje: '✅ Carta creada correctamente', carta });
  } catch (error) {
    console.error('❌ Error al crear carta:', error);
    res.status(500).json({ error: 'Error interno al crear carta' });
  }
};

exports.eliminarCartas = async (req, res) => {
  try {
    const { cartaIds } = req.body;

    if (!Array.isArray(cartaIds) || cartaIds.length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar una lista de IDs' });
    }

    await CartaExistente.deleteMany({ _id: { $in: cartaIds } });
    res.status(200).json({ mensaje: '✅ Cartas eliminadas correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar cartas:', error);
    res.status(500).json({ error: 'Error interno al eliminar cartas' });
  }
};

exports.modificarCarta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, rareza, tipos, imagen, descripcion } = req.body;

    const carta = await CartaExistente.findByIdAndUpdate(
      id,
      { nombre, rareza, tipos, imagen, descripcion },
      { new: true }
    );

    if (!carta) {
      return res.status(404).json({ error: 'Carta no encontrada' });
    }

    res.status(200).json({ mensaje: '✅ Carta modificada correctamente', carta });
  } catch (error) {
    console.error('❌ Error al modificar carta:', error);
    res.status(500).json({ error: 'Error interno al modificar carta' });
  }
};

exports.obtenerCartas = async (req, res) => {
  try {
    const cartas = await CartaExistente.find();
    res.status(200).json({ cartas });
  } catch (error) {
    console.error('❌ Error al obtener cartas:', error);
    res.status(500).json({ error: 'Error interno al obtener cartas' });
  }
};
