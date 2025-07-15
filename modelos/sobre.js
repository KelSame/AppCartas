const mongoose = require('mongoose');

const esquemaSobre = new mongoose.Schema({
  usuarioId: { type: Number, required: true, unique: true },
  cantidad: Number,
});

module.exports = mongoose.model('Sobre', esquemaSobre);