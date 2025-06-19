const Usuario = require('../modelos/usuario');

exports.registrarUsuario = async (req, res) => {
  try {
    const { usuario, correo, contrasena } = req.body;

    if (!usuario || !correo || !contrasena) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const existeCorreo = await Usuario.findOne({ correo });
    const existeUsuario = await Usuario.findOne({ usuario });

    if (existeCorreo || existeUsuario) {
      return res.status(400).json({ error: 'El correo o usuario ya está en uso' });
    }

    const nuevoUsuario = new Usuario({
      usuarioId: Math.floor(Math.random() * 1000000),
      usuario: usuario.trim(),
      correo: correo.trim(),
      contrasena: contrasena.trim(),
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Registrado correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const identificador = req.body.identificador?.trim();
    const contrasena = req.body.contrasena?.trim();

    if (!identificador || !contrasena) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    const usuario = await Usuario.findOne({
      $or: [
        { usuario: identificador },
        { correo: identificador }
      ],
      contrasena: contrasena
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        _id: usuario.usuarioId,
        usuario: usuario.usuario,
        correo: usuario.correo
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
