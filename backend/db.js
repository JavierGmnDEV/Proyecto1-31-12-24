// config/database.js
const { Sequelize } = require('sequelize');

// Configura la conexión a la base de datos
const sequelize = new Sequelize(
  'pid',     // Nombre de la base de datos
  'root',    // Usuario
  '',        // Contraseña (vacío en tu caso)
  {
    host: 'localhost',   // Servidor de la base de datos
    port: 3306,          // Puerto de la base de datos
    dialect: "mysql",    // Dialecto de la base de datos
    logging: false,      // Desactiva el logging de las consultas SQL en consola
    define: {
      timestamps: false, // Desactiva los timestamps por defecto en todos los modelos
    },
    pool: {
      max: 5,            // Número máximo de conexiones en el pool
      min: 0,            // Número mínimo de conexiones en el pool
      acquire: 30000,    // Tiempo máximo en milisegundos que Sequelize intentará obtener una conexión antes de lanzar un error
      idle: 10000,       // Tiempo máximo en milisegundos que una conexión puede estar inactiva antes de ser liberada
    },
  }
);

module.exports = sequelize;

