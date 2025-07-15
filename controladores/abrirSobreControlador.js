const CartaExistente = require('../modelos/cartasExistentes');
const CartaUsuario = require('../modelos/cartasUsuarios');
const Usuario = require('../modelos/usuario');
const Historial = require('../modelos/historialCompras');
const SobresCalidad = require('../modelos/sobresCalidades');
const SobresUsuario = require('../modelos/sobresUsuarios');

// ✅ Función para obtener una rareza aleatoria según las probabilidades
const getRarezaAleatoria = (probabilidades) => {
  const plainProbabilidades = probabilidades instanceof Map
    ? Object.fromEntries(probabilidades)
    : probabilidades;

  const total = Object.values(plainProbabilidades).reduce((sum, val) => sum + val, 0);
  const aleatorio = Math.random() * total;
  console.log(`🎰 Número aleatorio: ${aleatorio.toFixed(2)} / total: ${total}`);

  let acumulado = 0;

  for (const [rareza, porcentaje] of Object.entries(plainProbabilidades)) {
    acumulado += porcentaje;
    console.log(`➕ ${rareza}: ${porcentaje}%, acumulado: ${acumulado}`);
    if (aleatorio <= acumulado) return rareza;
  }

  return 'común'; // Fallback por si falla todo
};

// ✅ Controlador principal
const abrirSobreControlador = async (req, res) => {
  try {
    const { usuarioId, tipo } = req.body;

    if (!usuarioId || !tipo) {
      return res.status(400).json({ mensaje: 'Faltan usuarioId o tipo de sobre' });
    }

    const usuario = await Usuario.findOne({ usuarioId });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const tipoCampo = {
      basico: 'basicos',
      raro: 'raros',
      elite: 'elites'
    }[tipo];

    if (!tipoCampo) {
      return res.status(400).json({ mensaje: 'Tipo de sobre inválido' });
    }

    const sobresDoc = await SobresUsuario.findOne({ usuarioId });

    if (!sobresDoc || sobresDoc[tipoCampo] < 1) {
      return res.status(400).json({ mensaje: `No tienes sobres ${tipo} disponibles` });
    }

    const rarezaMap = {
      basico: 'Sobre Básico',
      raro: 'Sobre Raro',
      elite: 'Sobre Élite',
    };

    const rareza = rarezaMap[tipo];
    if (!rareza) {
      return res.status(400).json({ mensaje: 'Tipo de sobre no válido' });
    }

    const config = await SobresCalidad.findOne({ rareza });
    if (!config || !config.probabilidades) {
      return res.status(500).json({ mensaje: 'No se encontraron probabilidades para este sobre' });
    }

    // ✅ Debug log: Probabilidades reales del sobre
    console.log('🔍 Probabilidades del sobre:', Object.fromEntries(config.probabilidades));

    // ✅ Restar el sobre usado
    sobresDoc[tipoCampo] -= 1;
    await sobresDoc.save();

    const cartasObtenidas = [];

    for (let i = 0; i < 5; i++) {
      const rarezaSeleccionada = getRarezaAleatoria(config.probabilidades);
      const cartas = await CartaExistente.find({ rareza: rarezaSeleccionada });

      if (cartas.length === 0) continue;

      const cartaAleatoria = cartas[Math.floor(Math.random() * cartas.length)];

      const existente = await CartaUsuario.findOne({
        usuarioId,
        cartaId: cartaAleatoria._id,
      });

      if (existente) {
        existente.cantidad += 1;
        await existente.save();
      } else {
        await CartaUsuario.create({
          usuarioId,
          cartaId: cartaAleatoria._id,
          alias: cartaAleatoria.nombre,
          cantidad: 1,
        });
      }

      cartasObtenidas.push({
        _id: cartaAleatoria._id,
        nombre: cartaAleatoria.nombre,
        rareza: cartaAleatoria.rareza,
        tipos: cartaAleatoria.tipos,
        imagen: cartaAleatoria.imagen,
        descripcion: cartaAleatoria.descripcion,
      });
    }

    return res.status(200).json({
      mensaje: 'Sobre abierto exitosamente',
      cartas: cartasObtenidas,
    });
  } catch (error) {
    console.error('❌ Error al abrir sobre:', error);
    return res.status(500).json({ mensaje: 'Error al abrir el sobre' });
  }
};

module.exports = { abrirSobreControlador };
