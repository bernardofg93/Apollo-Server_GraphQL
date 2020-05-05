const { ApolloServer } = require("apollo-server");

const jwt = require("jsonwebtoken");
require("dotenv").config("variables.env");
//se importan los types definitions
const typeDefs = require("./db/schema");
//se importan los resolvers
const resolvers = require("./db/resolvers");

const conectarDB = require("./config/db");

//conexion a la bd mongo
conectarDB();

//se crea instancia de apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers['authorization'] || '';
    if(token) {
      try {
        const usuario = jwt.verify(token, process.env.SECRETA);
        return {
          usuario
        }
      } catch (error) {

      }
    }
  },
});
//se crea servidor de apollo
server.listen().then(({ url }) => {
  console.log(`Servidor listo en la URL ${url}`);
});

//schema todos los servidores de graphql con tienen estos , sirven para darle estructura a los datos
//que el cliente va a mostrar

//resolvers: son funciones que se encargan de retornar los valores que existen en tu schema , una funcion que se va a conectar
//con tu schema con tus typeDef con tus datos o base de datos

//se les conoce como type definitions por que tienes que describir la forma que vas a obtener los datos y que es lo que deseas obtener

// de esta forma te retorna el titulo de tipo estring
//y para obtener los cursos si lo encierras en arreglo vas a optener multiplos curos , de lo contrario solo recives uno

//type query : son funciones
// type Curso : se crean los types
