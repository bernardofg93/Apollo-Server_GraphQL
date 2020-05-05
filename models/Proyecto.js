const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true, // elimina espacios en blanco
  },
  creador: {
    //se guarda la refencia de la persona que esta autenticada y que esta creando
    //el proyecto de esta forma se comprueba que es el propietario del proyecto
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  //se crea el dato de cuando es creada la tarea
  creado: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);
