const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error conectando a MongoDB', err));

app.use('/api', require('./rutas/api'));
app.use('/api/admin/regalos', require('./rutas/rutasAdminRegalos'));
app.use('/api/admin/monstruos', require('./rutas/rutasAdminMonstruos'));
app.use('/api/admin/sobres', require('./rutas/rutasAdminSobres'));
app.use('/api/admin/usuarios', require('./rutas/rutasAdminUsuarios'));
app.use('/api/admin/cuenta', require('./rutas/rutasAdminCuenta'));

module.exports = app;
