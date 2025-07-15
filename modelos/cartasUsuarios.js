const mongoose = require('mongoose');
const cartaUsuarioSchema = new mongoose.Schema({
  usuarioId: Number,
  cartaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartaExistente', // ✅ Esto activa el populate
  },
  alias: String,
  cantidad: Number,
});
module.exports = mongoose.model('CartaUsuario', cartaUsuarioSchema);
