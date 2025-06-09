const Tipo = require('../modelos/tipos');

exports.crearTipo = async (req, res) => {
  try {
    const { nombre, imagen } = req.body;

    if (!nombre || !imagen) {
      return res.status(400).json({ error: 'Faltan datos del tipo' });
    }

    const existe = await Tipo.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ error: 'Este tipo ya existe' });
    }

    const tipo = await Tipo.create({ nombre, imagen });
    res.status(201).json({ mensaje: '✅ Tipo creado correctamente', tipo });
  } catch (error) {
    console.error('❌ Error al crear tipo:', error);
    res.status(500).json({ error: 'Error interno al crear tipo' });
  }
};

exports.obtenerTipos = async (req, res) => {
  try {
    const tipos = await Tipo.find();
    res.status(200).json({ tipos });
  } catch (error) {
    console.error('❌ Error al obtener tipos:', error);
    res.status(500).json({ error: 'Error al obtener tipos' });
  }
};

exports.eliminarTipos = async (req, res) => {
  try {
    const { tipoIds } = req.body;
    if (!Array.isArray(tipoIds) || tipoIds.length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar una lista de IDs de tipos' });
    }

    await Tipo.deleteMany({ _id: { $in: tipoIds } });
    res.status(200).json({ mensaje: '✅ Tipos eliminados correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar tipos:', error);
    res.status(500).json({ error: 'Error interno al eliminar tipos' });
  }
};

exports.modificarTipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, imagen } = req.body;

    const tipo = await Tipo.findByIdAndUpdate(
      id,
      { nombre, imagen },
      { new: true }
    );

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo no encontrado' });
    }

    res.status(200).json({ mensaje: '✅ Tipo actualizado correctamente', tipo });
  } catch (error) {
    console.error('❌ Error al actualizar tipo:', error);
    res.status(500).json({ error: 'Error interno al actualizar tipo' });
  }
};
