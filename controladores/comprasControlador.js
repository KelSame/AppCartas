const Usuario = require('../modelos/usuario');
const SobreUsuario = require('../modelos/sobresUsuarios');
const IntentosPaquetes = require('../modelos/intentosPaquetes');

const comprarSobre = async (req, res) => {
  try {
    const { usuarioId, tipo } = req.body;
    const precios = { basico: 100, raro: 250, elite: 550 };

    if (!usuarioId || !precios[tipo]) {
      return res.status(400).json({ mensaje: 'Datos inválidos' });
    }

    const usuario = await Usuario.findOne({ usuarioId });
    if (!usuario || usuario.monto < precios[tipo]) {
      return res.status(400).json({ mensaje: 'Fondos insuficientes' });
    }

    usuario.monto -= precios[tipo];
    await usuario.save();

    let sobres = await SobreUsuario.findOne({ usuarioId });
    if (!sobres) {
      sobres = new SobreUsuario({ usuarioId, basicos: 0, raros: 0, elites: 0 });
    }

    sobres[`${tipo}s`] += 1; // Ej: 'basicos', 'raros'
    await sobres.save();

    return res.status(200).json({ mensaje: 'Compra exitosa', nuevoMonto: usuario.monto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al comprar sobre' });
  }
};

const comprarMonedas = async (req, res) => {
  try {
    const { usuarioId, cantidad } = req.body;

    if (!usuarioId || !cantidad || cantidad <= 0) {
      return res.status(400).json({ mensaje: 'Datos inválidos' });
    }

    const usuario = await Usuario.findOne({ usuarioId });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.monto += cantidad;
    await usuario.save();

    return res.status(200).json({ nuevoMonto: usuario.monto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al agregar monedas' });
  }
};

const actualizarIntentos = async (usuarioId) => {
  let intento = await IntentosPaquetes.findOne({ usuarioId });

  if (!intento) {
    intento = await IntentosPaquetes.create({
      usuarioId,
      intentos: { paquete150: 10, paquete300: 7, paquete600: 5 },
      ultimaRecarga: new Date(),
    });
    return intento;
  }

  const ahora = Date.now();
  const ultimoReinicioHecho = Math.floor(ahora / (5 * 60 * 1000)) * (5 * 60 * 1000);

  if (new Date(intento.ultimaRecarga).getTime() < ultimoReinicioHecho) {
    intento.intentos = { paquete150: 10, paquete300: 7, paquete600: 5 };
    intento.ultimaRecarga = new Date(ultimoReinicioHecho);
    await intento.save();
  }

  return intento;
};

const canjearMonedas = async (req, res) => {
  try {
    const { usuarioId, cantidad } = req.body;

    if (!usuarioId || ![150, 300, 600].includes(cantidad)) {
      return res.status(400).json({ mensaje: 'Datos inválidos' });
    }

    const intentos = await actualizarIntentos(usuarioId);

    const clave = cantidad === 150 ? 'paquete150'
                : cantidad === 300 ? 'paquete300'
                : 'paquete600';

    if (intentos.intentos[clave] <= 0) {
      return res.status(400).json({ mensaje: 'Límite alcanzado para este paquete' });
    }

    const usuario = await Usuario.findOne({ usuarioId });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.monto += cantidad;
    intentos.intentos[clave] -= 1;

    await usuario.save();
    await intentos.save();

    return res.status(200).json({
      nuevoMonto: usuario.monto,
      intentosRestantes: intentos.intentos
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al canjear monedas' });
  }
};

const obtenerIntentos = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const intentos = await actualizarIntentos(usuarioId);
    return res.status(200).json(intentos.intentos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error al obtener los intentos' });
  }
};


module.exports = {
  comprarSobre,
  comprarMonedas,
  actualizarIntentos,
  canjearMonedas,
  obtenerIntentos,
};
