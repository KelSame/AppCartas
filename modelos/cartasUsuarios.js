const mongoose = require('mongoose');
const cartaUsuarioSchema = new mongoose.Schema({
  usuarioId: Number,
  cartaId: mongoose.Schema.Types.ObjectId,
  alias: String,
  cantidad: Number,
});
module.exports = mongoose.model('CartaUsuario', cartaUsuarioSchema);
