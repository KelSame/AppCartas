const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  usuarioId: { type: Number, required: true, unique: true },
  usuario: { type: String, required: true, unique: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  monto: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Usuario', esquemaUsuario);
