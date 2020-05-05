const Usuario = require("../models/Usuario");
const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

//crea y firma un JWT
const crearToken = (usuario, secreta, expiresIn) => {
  console.log(usuario);

  const { id, email } = usuario;

  return jwt.sign({ id, email }, secreta, { expiresIn });
};

//resolvers
const resolvers = {
  Query: {
    obtenerProyectos: async (_, {}, ctx) => {
      const proyectos = await Proyecto.find({ creador: ctx.usuario.id });

      return proyectos;
    },
  },
  Mutation: {
    crearUsuario: async (_, { input }) => {
      const { email, password } = input;

      const existeUsuario = await Usuario.findOne({ email });

      //validacion previa
      //si existe usuario
      if (existeUsuario) {
        throw new Error("El usuario ya esta registrado");
      }

      try {
        // Hashear password
        const salt = await bcryptjs.genSalt(10);
        //parte del objeto que se va a modificar
        input.password = await bcryptjs.hash(password, salt);

        //se crea instancia del usuario (regostra nuevo usuario)
        const nuevoUsuario = new Usuario(input);
        //console.log(nuevoUsuario);

        //se guarda en la base de datos
        nuevoUsuario.save();
        return "Usuario creado correctamente";
      } catch (error) {
        console.log(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;

      //si el usuario existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }

      //si el password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );

      if (!passwordCorrecto) {
        throw new Error("Password Incorrecto");
      }

      //dar acceso a la app
      return {
        token: crearToken(existeUsuario, process.env.SECRETA, "2hr"),
      };
    },
    nuevoProyecto: async (_, { input }, ctx) => {
      try {
        //creamos nueva instancia
        const proyecto = new Proyecto(input);

        //asociar el creador
        proyecto.creador = ctx.usuario.id;

        // almacenarl en la BD
        const resultado = await proyecto.save();

        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarProyecto: async (_, { id, input }, ctx) => {
      // Revisar si el proyecto existe o no
      let proyecto = await Proyecto.findById(id);

      if (!proyecto) {
        throw new Error("Proyecto no encontrado");
      }

      //revisar si la persona que trata de editarlo, es el creador
      if (proyecto.creador.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales para editar");
      }

      //Guardar el proyecto
      proyecto = await Proyecto.findByIdAndUpdate({ _id: id }, input, {
        new: true,
      });
      return proyecto;
    },
    eliminarProyecto: async (_, { id }, ctx) => {
      // Revisar si el proyecto existe o no
      let proyecto = await Proyecto.findById(id);

      if (!proyecto) {
        throw new Error("Proyecto no encontrado");
      }

      //revisar si la persona que trata de editarlo, es el creador
      if (proyecto.creador.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales para editar");
      }

      // Eliminar
      await Proyecto.findByIdAndDelete({ _id : id });

      return "Proyecto eliminado";
    },
    nuevaTarea:  async (_, { input }, ctx) => {
      try {
        //el usuario crea la tarea
        const tarea = new Tarea(input);

        tarea.creador = ctx.usuario.id;
        
        const resultado = await tarea.save();

        return resultado;

      } catch (error) {
        console.log(error);
      }
    },
    actualizarTarea:  async (_, {id ,input, estado}, ctx) => {
      //si la tarea existe o no 
      let tarea = await Tarea.findById( id );

      if(!tarea) {
        throw new Error('Tarea no encontrada');
      }

      //si la persona que edita es el creador
      if(tarea.creador.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales para editar");
      }

      //asignar estado
      input.estado = estado;

      // Guardar y retornar la tarea
      tarea = await Tarea.findByIdAndUpdate({ _id : id }, input, { new: true}); 

      return tarea;
    }
  },
};
module.exports = resolvers;

//mutation la funcion recive como argumentos 4 parametrods el primero
// (_) se refiere al root del type padre
// { input } nos permite leer lo que el usuario manda desde el imput
// ctx nos sirve para saber que usuario esta eutenticado
//findOne lo que hace es buscar un registro que concuerde con el password que le vamos a pasar
