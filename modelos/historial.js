const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
  usuarioId: Number,
  nombre: String,
  rareza: String,
  fecha: Date
}, { timestamps: true });

module.exports = mongoose.model('Historial', historialSchema);
