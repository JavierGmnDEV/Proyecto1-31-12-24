const express = require('express');
const sequelize = require('./db');  // Tu conexión a la base de datos MySQL
const parseJson = require('./midellware/parseJSON.js');
const db = require('./models'); // Asegúrate de la ruta correcta
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet'); // Asegúrate de instalar helmet

// Importar las rutas
const administracionRoutes = require('./routes/Administracion.routes.js');
const centroRoutes = require('./routes/Centro.routes.js');
const profesorRoutes = require('./routes/Profesor.routes.js');
const planDeClaseRoutes = require('./routes/PlanDeClase.routes.js');
const temaRoutes = require('./routes/Tema.routes.js');
const claseRoutes = require('./routes/Clase.routes.js');
const eventoRoutes = require('./routes/Evento.routes.js');
const evaluacionRoutes = require('./routes/Evaluacion.routes.js');
const entregaRoutes = require('./routes/Entrega.routes.js');
const planDeFormacionRoutes = require('./routes/PlanDeFormacion.routes.js');
const actividadesRoutes = require('./routes/Actividades.routes.js');
// Rutas adicionales específicas
const notaRoutes = require('./routes/Nota.routes.js');
const asistenciaRoutes = require('./routes/Asistencia.routes.js');
const estudianteRoutes = require('./routes/Estudiante.routes.js');
const AutenticacionRoutes = require('./routes/Autenticacion.routes.js');

const app = express();

// Middleware para procesar JSON
app.use(parseJson);

// Configurar CORS para permitir peticiones desde http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173', // Dominio del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));

// Usar Helmet para seguridad adicional
app.use(helmet()); // Para agregar cabeceras de seguridad predeterminadas

app.use(helmet.xContentTypeOptions()); // Evitar el tipo de contenido incorrecto

// Protección contra Clickjacking (X-Frame-Options)
app.use(helmet.frameguard({ action: 'deny' })); // Bloquea cargar en iframe

// Configuración de la Política de Seguridad de Contenidos (CSP)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"], // Solo permite fuentes desde el mismo origen
    scriptSrc: ["'self'", "'unsafe-inline'", "http://localhost:5173"], // Permite scripts desde el mismo origen y inline
    styleSrc: ["'self'", "'unsafe-inline'"], // Permite estilos desde el mismo origen y inline
    imgSrc: ["'self'", "http://localhost:5173"], // Permite imágenes desde el mismo origen
    connectSrc: ["'self'", "http://localhost:5173"], // Permite conexiones desde el mismo origen
    fontSrc: ["'self'"], // Permite fuentes desde el mismo origen
    objectSrc: ["'none'"], // Bloquea el uso de objetos
    frameAncestors: ["'none'"], // Impide que el sitio sea cargado en un iframe
    upgradeInsecureRequests: [], // Fuerza las solicitudes HTTP a HTTPS
  },
}));

// Agregar X-Content-Type-Options
app.use(helmet.xContentTypeOptions()); // Agrega X-Content-Type-Options
// Rutas adicionales para robots.txt y sitemap.xml
app.use('/robots.txt', (req, res) =>res.status(404).json({
  msg: 'te embarcaste',
}));
app.use('/sitemap.xml', (req, res) =>res.status(404).json({
  msg: 'te embarcaste',
}));

// Usar las rutas
app.use('/login', AutenticacionRoutes);
app.use('/administracion', administracionRoutes);
app.use('/centro', centroRoutes);
app.use('/profesor', profesorRoutes);
app.use('/plan-de-clase', planDeClaseRoutes);
app.use('/tema', temaRoutes);
app.use('/clase', claseRoutes);
app.use('/evento', eventoRoutes);
app.use('/evaluacion', evaluacionRoutes);
app.use('/entrega', entregaRoutes);
app.use('/plan-de-formacion', planDeFormacionRoutes);
app.use('/actividades', actividadesRoutes);
// Rutas adicionales
app.use('/notas', notaRoutes);
app.use('/asistencia', asistenciaRoutes);
app.use('/estudiantes', estudianteRoutes);

// Definir el puerto antes de usarlo
const PORT = process.env.PORT || 3000; // Asegúrate de tener el puerto definido en .env

// Autenticación de la base de datos
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Sincronizar la base de datos y luego iniciar el servidor
sequelize.sync({ force: false })
  .then(() => {
   
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas con la base de datos:', error);
  });

// Agregar un manejador de errores para capturar errores en el servidor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});
