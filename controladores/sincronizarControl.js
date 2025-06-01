const Usuario = require('../modelos/usuario');
const Carta = require('../modelos/carta');
const Sobre = require('../modelos/sobre');
const Historial = require('../modelos/historial');

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
        rol: usuario.rol,
        $inc: { monto: usuario.monto || 0 }
      },
      { upsert: true, new: true }
    );
    console.log('✅ Usuario sincronizado:', usuarioActualizado);

    for (const carta of cartas) {
      const existente = await Carta.findOne({
        usuarioId: usuario.usuarioId,
        nombre: carta.nombre,
      });

      if (existente) {
        existente.cantidad += carta.cantidad;
        await existente.save();
        console.log(`🔁 Carta actualizada: ${carta.nombre}`);
      } else {
        await Carta.create({
          usuarioId: usuario.usuarioId,
          nombre: carta.nombre,
          alias: carta.alias,
          rareza: carta.rareza,
          cantidad: carta.cantidad,
        });
        console.log(`🆕 Carta creada: ${carta.nombre}`);
      }
    }

    const sobreExistente = await Sobre.findOne({ usuarioId: usuario.usuarioId });
    if (sobreExistente) {
      sobreExistente.sinAbrir = sobres.sinAbrir;
      await sobreExistente.save();
      console.log('🔁 Sobre actualizado:', sobreExistente);
    } else {
      const nuevoSobre = await Sobre.create({
        usuarioId: usuario.usuarioId,
        sinAbrir: sobres.sinAbrir,
      });
      console.log('🆕 Sobre creado:', nuevoSobre);
    }

    for (const h of historial) {
      const yaExiste = await Historial.findOne({
        usuarioId: usuario.usuarioId,
        nombre: h.nombre,
        rareza: h.rareza,
        fecha: h.fecha,
      });

      if (!yaExiste) {
        await Historial.create({
          usuarioId: usuario.usuarioId,
          nombre: h.nombre,
          rareza: h.rareza,
          fecha: h.fecha,
        });
        console.log(`🆕 Entrada de historial agregada: ${h.nombre}`);
      } else {
        console.log(`⏩ Entrada ya existente en historial: ${h.nombre}`);
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

    const cartas = await Carta.find({ usuarioId });
    const sobres = await Sobre.findOne({ usuarioId });
    const usuario = await Usuario.findOne({ usuarioId });
    const historial = await Historial.find({ usuarioId });

    res.status(200).json({
      cartas,
      sobres: sobres ? { sinAbrir: Number(sobres.sinAbrir) } : null,
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
    await Carta.deleteMany({ usuarioId });
    await Sobre.deleteMany({ usuarioId });
    await Historial.deleteMany({ usuarioId });
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
