const mongoose = require('mongoose');

const sobreCalidadSchema = new mongoose.Schema({
  rareza: String,
  imagen: String,
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  probabilidades: {
    type: Map,
    of: Number
  },
});

module.exports = mongoose.model('SobreCalidad', sobreCalidadSchema);
