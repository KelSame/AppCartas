const Usuario = require('../modelos/usuario');
const SobreUsuario = require('../modelos/sobresUsuarios');

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


module.exports = {
  comprarSobre,
  comprarMonedas,
};
