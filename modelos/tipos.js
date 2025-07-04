const mongoose = require('mongoose');

const tipoSchema = new mongoose.Schema({
  tipoId: {
    type: Number,
    unique: true
  },
  nombre: { type: String, required: true, unique: true },
  imagen: { type: String, required: true }
}, { timestamps: true });

tipoSchema.pre('save', async function (next) {
  if (this.isNew && !this.tipoId) {
    const ult = await mongoose.model('Tipo').findOne().sort({ tipoId: -1 });
    this.tipoId = ult ? ult.tipoId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Tipo', tipoSchema);

