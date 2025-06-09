const mongoose = require('mongoose');
const cartaSchema = new mongoose.Schema({
  nombre: String,
  rareza: {
    type: String,
    enum: ['común', 'raro', 'épico', 'legendario'],
    required: true
  },
  tipos: [String],
  imagen: String,
  descripcion: String,
});
module.exports = mongoose.model('CartaExistente', cartaSchema);
