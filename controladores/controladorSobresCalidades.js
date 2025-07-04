const SobreCalidad = require('../modelos/sobresCalidades');
const validarProbabilidades = require('../validacion/validarProbabilidades');
const Carta = require('../modelos/cartasExistentes');

exports.crearSobre = async (req, res) => {
  try {
    const { rareza, imagen, precio, probabilidades } = req.body;

    if (!precio || isNaN(precio) || precio <= 0) {
      return res.status(400).json({ error: 'El precio debe ser un número mayor a 0' });
    }

    const { valido, mensaje } = validarProbabilidades(probabilidades);
    if (!valido) return res.status(400).json({ error: mensaje });

    const nuevo = new SobreCalidad({ rareza, imagen, precio, probabilidades });
    await nuevo.save();

    res.status(201).json({ mensaje: '✅ Sobre creado correctamente', sobre: nuevo });
  } catch (error) {
    console.error('❌ Error al crear sobre:', error);
    res.status(500).json({ error: 'Error interno al crear sobre' });
  }
};

exports.obtenerSobres = async (req, res) => {
  try {
    const sobres = await SobreCalidad.find();
    res.status(200).json({ sobres });
  } catch (error) {
    console.error('❌ Error al obtener sobres:', error);
    res.status(500).json({ error: 'Error interno al obtener sobres' });
  }
};

exports.eliminarSobres = async (req, res) => {
  try {
    const { ids } = req.body;
    await SobreCalidad.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ mensaje: '✅ Sobres eliminados correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar sobres:', error);
    res.status(500).json({ error: 'Error interno al eliminar sobres' });
  }
};

exports.modificarSobre = async (req, res) => {
  try {
    const { id } = req.params;
    const { rareza, imagen, precio, probabilidades } = req.body;

    if (!precio || isNaN(precio) || precio <= 0) {
      return res.status(400).json({ error: 'El precio debe ser un número mayor a 0' });
    }

    const { valido, mensaje } = validarProbabilidades(probabilidades);
    if (!valido) return res.status(400).json({ error: mensaje });

    const sobre = await SobreCalidad.findByIdAndUpdate(
      id,
      { rareza, imagen, precio, probabilidades },
      { new: true }
    );

    if (!sobre) return res.status(404).json({ error: 'Sobre no encontrado' });

    res.status(200).json({ mensaje: '✅ Sobre actualizado correctamente', sobre });
  } catch (error) {
    console.error('❌ Error al modificar sobre:', error);
    res.status(500).json({ error: 'Error interno al modificar sobre' });
  }
};
exports.obtenerRarezas = async (req, res) => {
  const rarezas = await Carta.distinct('rareza');
  const rarezasValidas = ['común', 'raro', 'épico', 'legendario'];
  const filtradas = rarezas.filter(r => rarezasValidas.includes(r.toLowerCase()));
  res.json(filtradas);
};
