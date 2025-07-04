const mongoose = require('mongoose');

const administradorSchema = new mongoose.Schema({
  adminId: {
    type: Number,
    unique: true
  },
  usuario: {
    type: String,
    required: true,
    unique: true,
    trim: false 
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: false
  },
  contrasena: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  }
}, { timestamps: true });

administradorSchema.pre('save', async function (next) {
  if (this.isNew && typeof this.adminId === 'undefined') {
    const ultimo = await mongoose.model('Administrador').findOne().sort({ adminId: -1 });
    this.adminId = ultimo ? ultimo.adminId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Administrador', administradorSchema);
