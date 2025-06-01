const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  usuarioId: { type: Number, required: true, unique: true },
  usuario: { type: String, required: true }, // ← antes era `nombre`
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
  monto: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Usuario', esquemaUsuario);
