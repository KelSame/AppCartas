const mongoose = require('mongoose');
const compraSchema = new mongoose.Schema({
  usuarioId: Number,
  tipo: String,
  precio: Number,
  fecha: Date,
});
module.exports = mongoose.model('HistorialCompra', compraSchema);
