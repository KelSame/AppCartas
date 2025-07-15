const mongoose = require('mongoose');

const intentoSchema = new mongoose.Schema({
  usuarioId: { type: Number, required: true, unique: true },
  intentos: {
    paquete150: { type: Number, default: 10 },
    paquete300: { type: Number, default: 7 },
    paquete600: { type: Number, default: 5 },
  },
  ultimaRecarga: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IntentosPaquetes', intentoSchema);
