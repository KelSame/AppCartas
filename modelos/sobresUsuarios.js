const mongoose = require('mongoose');
const sobreUsuarioSchema = new mongoose.Schema({
  usuarioId: Number,
  basicos: { type: Number, default: 0 },
  raros: { type: Number, default: 0 },
  elites: { type: Number, default: 0 },
});
module.exports = mongoose.model('SobreUsuario', sobreUsuarioSchema);
