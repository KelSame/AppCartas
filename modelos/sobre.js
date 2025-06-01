const mongoose = require('mongoose');

const esquemaSobre = new mongoose.Schema({
  usuarioId: { type: Number, required: true, unique: true },
  sinAbrir: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Sobre', esquemaSobre);
