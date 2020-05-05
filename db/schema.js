const { gql } = require("apollo-server");

const typeDefs = gql`

  type Token {
    token: String
  }

  type Proyecto {
    nombre: String
    id: ID
  }

  type Tarea {
    nombre: String
    id: ID
    proyecto: String
    estado: Boolean
  }

  type Query {
    obtenerProyectos : [Proyecto]
  }


  input UsuarioInput {
      nombre: String!
      email: String!
      password: String!
  }

  input AutenticarInput {
    email: String!
    password: String!

  }

  input ProyectoInput { 
    nombre: String!
  }

  input TareaInput {
    nombre: String!
    proyecto: String!
  }


  type Mutation {
    # Proyectos
    crearUsuario(input: UsuarioInput) : String
    autenticarUsuario(input: AutenticarInput ): Token
    nuevoProyecto(input: ProyectoInput) : Proyecto
    actualizarProyecto(id : ID!, input: ProyectoInput): Proyecto
    eliminarProyecto(id: ID!) : String

    # Tareas
    nuevaTarea(input: TareaInput ) : Tarea 
    actualizarTarea(id: ID!, input: TareaInput, estado: Boolean ): Tarea
  }
`;
//actualizarProyecto(id : ID!, input ProyectoInput): Proyecto
//De esta forma sabemos que proyecto estamos actualizando

module.exports = typeDefs;

//type Query sirve para optener los datos como un select o un get solo te trae datos

// type Mutation crea nuevos registros los actualiza o los elimina

//inputs en graphql es la forma en la cual pasas argumentos o valores alos mutations

// el signo de exclamacion(!) nos ayuda a decir que son campos obligatorios
