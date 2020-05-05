const mongoose = require('mongoose');

//modelo de base de datos para mongo
const UsuariosSchema = mongoose.Schema({
    nombre:{
       type: String,//tipo de dato para mongo
       require: true,//de esta forma le decimos que no puede ser null este valor
       trim: true//quita los espacios generados al momento de insertar 
    },
    email:{
       type: String,
       require: true,
       trim: true,
       unique: true
    },
    password: {
       type: String,
       require: true,
       trim: true//le decimos que solo puede crear una cuenta con este correo
    },
    registro: {
       type: Date,//tipo fecha
       default: Date.now()//cada que alguien se registre va a tomar la fecha del registro
    }
});

module.exports = mongoose.model('Usuario', UsuariosSchema);