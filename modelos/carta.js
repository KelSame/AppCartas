const mongoose = require('mongoose');

const esquemaCarta = new mongoose.Schema({
  usuarioId: { type: Number, required: true },
  nombre: String,
  alias: String,
  rareza: String,
  cantidad: Number,
  fecha: Date,
}, { timestamps: true });

module.exports = mongoose.model('Carta', esquemaCarta);
