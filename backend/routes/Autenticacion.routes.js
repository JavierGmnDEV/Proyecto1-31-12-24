const express = require('express');
const router = express.Router();

const { loginAdministrador, loginEstudiante, loginProfesor } = require("../controller/Autenticacion.controller");



// Ruta para login de Administrador
router.post('/administrador', loginAdministrador);

// Ruta para login de Estudiante
router.post('/estudiante', loginEstudiante);

// Ruta para login de Profesor
router.post('/profesor', loginProfesor);


module.exports = router;