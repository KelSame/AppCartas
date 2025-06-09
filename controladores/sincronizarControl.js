const Usuario = require('../modelos/usuario');
const CartaUsuario = require('../modelos/cartasUsuarios');
const SobreUsuario = require('../modelos/sobresUsuarios');
const HistorialCompra = require('../modelos/historialCompras');

exports.sincronizarDatos = async (req, res) => {
  try {
    const { usuario, cartas, sobres, historial } = req.body;

    console.log('📥 Datos recibidos en /sync:');
    console.log('🧑 Usuario:', usuario);
    console.log('🃏 Cartas:', cartas);
    console.log('📦 Sobres:', sobres);
    console.log('📜 Historial:', historial);

    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { usuarioId: usuario.usuarioId },
      {
        usuarioId: usuario.usuarioId,
        usuario: usuario.usuario,
        correo: usuario.correo,
        contrasena: usuario.contrasena,
        $inc: { monto: usuario.monto || 0 }
      },
      { upsert: true, new: true }
    );
    console.log('✅ Usuario sincronizado:', usuarioActualizado);

    for (const carta of cartas) {
      const existente = await CartaUsuario.findOne({
        usuarioId: usuario.usuarioId,
        nombre: carta.nombre
      });

      if (existente) {
        existente.cantidad += carta.cantidad;
        await existente.save();
        console.log(`🔁 Carta actualizada: ${carta.nombre}`);
      } else {
        await CartaUsuario.create({
          usuarioId: usuario.usuarioId,
          nombre: carta.nombre,
          alias: carta.alias,
          rareza: carta.rareza,
          cantidad: carta.cantidad
        });
        console.log(`🆕 Carta creada: ${carta.nombre}`);
      }
    }

    const sobresUsuario = await SobreUsuario.findOne({ usuarioId: usuario.usuarioId });
    if (sobresUsuario) {
      sobresUsuario.basicos = sobres.cantidad || 0;
      await sobresUsuario.save();
      console.log('🔁 Sobres actualizados:', sobresUsuario);
    } else {
      await SobreUsuario.create({
        usuarioId: usuario.usuarioId,
        basicos: sobres.cantidad || 0,
        raros: 0,
        elites: 0
      });
      console.log('🆕 Registro de sobres creado');
    }

    for (const h of historial) {
      const yaExiste = await HistorialCompra.findOne({
        usuarioId: usuario.usuarioId,
        tipo: h.tipo,
        precio: h.precio,
        fecha: h.fecha
      });

      if (!yaExiste) {
        await HistorialCompra.create({
          usuarioId: usuario.usuarioId,
          tipo: h.tipo,
          precio: h.precio,
          fecha: h.fecha
        });
        console.log(`🆕 Entrada de historial agregada: ${h.tipo}`);
      } else {
        console.log(`⏩ Entrada ya existente en historial: ${h.tipo}`);
      }
    }

    res.status(200).json({ mensaje: '✅ Sincronización exitosa' });
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
    res.status(500).json({ error: '❌ Error en sincronización' });
  }
};

exports.obtenerDatos = async (req, res) => {
  try {
    const { usuarioId } = req.query;

    const usuario = await Usuario.findOne({ usuarioId });
    const cartas = await CartaUsuario.find({ usuarioId });
    const sobres = await SobreUsuario.findOne({ usuarioId });
    const historial = await HistorialCompra.find({ usuarioId });

    res.status(200).json({
      cartas,
      sobres: sobres
        ? { basicos: sobres.basicos, raros: sobres.raros, elites: sobres.elites }
        : null,
      monedas: usuario && typeof usuario.monto === 'number'
        ? { monto: Number(usuario.monto) }
        : { monto: 0 },
      historial
    });
  } catch (error) {
    console.error('❌ Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    await Usuario.deleteOne({ usuarioId });
    await CartaUsuario.deleteMany({ usuarioId });
    await SobreUsuario.deleteMany({ usuarioId });
    await HistorialCompra.deleteMany({ usuarioId });
    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { usuarioId, usuario, correo } = req.body;
    await Usuario.findOneAndUpdate(
      { usuarioId },
      { usuario, correo },
      { new: true }
    );
    res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};
