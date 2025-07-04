const Usuario = require('../modelos/usuario');
const CartaUsuario = require('../modelos/cartasUsuarios');
const SobreUsuario = require('../modelos/sobresUsuarios');
const HistorialCompra = require('../modelos/historialCompras');
const CartaExistente = require('../modelos/cartasExistentes');

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
      const cartaExistente = await CartaExistente.findOne({ nombre: carta.nombre });
      if (!cartaExistente) {
        console.warn(`⚠️ CartaExistente no encontrada para: ${carta.nombre}`);
        continue;
      }
      
      const existente = await CartaUsuario.findOne({
        usuarioId: usuario.usuarioId,
        cartaId: cartaExistente._id
      });

      if (existente) {
        existente.cantidad += carta.cantidad;
        await existente.save();
        console.log(`🔁 Carta actualizada: ${carta.nombre}`);
      } else {
        await CartaUsuario.create({
          usuarioId: usuario.usuarioId,
          cartaId: cartaExistente._id,
          alias: carta.alias,
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
    const cartas = await CartaUsuario
      
      .find({ usuarioId })
      .populate({
        path: 'cartaId',
        populate: {
          path: 'tipos', // Esto asume que tipos es un array de refs en CartaExistente
          model: 'Tipo'
        }
      });
    const cartasFormateadas = cartas.map((c) => {
    const primerTipo = c.cartaId.tipos?.[0]; // Ya es un objeto con imagen y nombre
  
    return {
      _id: c.cartaId._id,
      nombre: c.cartaId.nombre,
      rareza: c.cartaId.rareza,
      tipos: c.cartaId.tipos,
      imagen: c.cartaId.imagen,
      descripcion: c.cartaId.descripcion,
      alias: c.alias,
      cantidad: c.cantidad,
      tipoNombre: primerTipo?.nombre || '',
      tipoImagen: primerTipo?.imagen || '',
    };
  });
    const cartasExistentes = await CartaExistente.find().populate('tipos');
    const cartasExistentesFormateadas = cartasExistentes.map((c) => ({
      _id: c._id,
      nombre: c.nombre,
      rareza: c.rareza,
      imagen: c.imagen,
      descripcion: c.descripcion,
      tipos: (c.tipos || []).map((t) => ({
        nombre: t.nombre,
        imagen: t.imagen,
      }))
    }));
    const sobres = await SobreUsuario.findOne({ usuarioId });
    const historial = await HistorialCompra.find({ usuarioId });
    

    res.status(200).json({
    cartas: cartasFormateadas,
    sobres: sobres ? {
      basicos: sobres.basicos,
      raros: sobres.raros,
      elites: sobres.elites
    } : null,
    monedas: usuario?.monto !== undefined ? { monto: Number(usuario.monto) } : { monto: 0 },
    historial,
    cartasExistentes: cartasExistentesFormateadas
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

exports.actualizarAlias = async (req, res) => {
  try {
    const { usuarioId, cartaId, nuevoAlias } = req.body;

    if (!usuarioId || !cartaId || !nuevoAlias) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const carta = await CartaUsuario.findOneAndUpdate(
      { usuarioId, cartaId },
      { alias: nuevoAlias },
      { new: true }
    );

    if (!carta) {
      return res.status(404).json({ error: 'Carta no encontrada para este usuario' });
    }

    res.status(200).json({ mensaje: 'Alias actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar alias:', error);
    res.status(500).json({ error: 'Error al actualizar alias' });
  }
};
