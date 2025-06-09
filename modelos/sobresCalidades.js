const mongoose = require('mongoose');
const sobreCalidadSchema = new mongoose.Schema({
  rareza: String,
  imagen: String,
  probabilidades: {
    type: Map,
    of: Number
  },
});
module.exports = mongoose.model('SobreCalidad', sobreCalidadSchema);
