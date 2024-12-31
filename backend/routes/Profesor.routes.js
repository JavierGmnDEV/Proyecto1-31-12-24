const express = require('express');
const router = express.Router();
const profesorController = require('../controller/Profesor.controller');

// Rutas para Profesores
router.get('/', profesorController.obtenerProfesores); // Obtener todos los profesores
router.get('/:id', profesorController.obtenerProfesorPorId); // Obtener un profesor por ID
router.post('/', profesorController.crearProfesor); // Crear un nuevo profesor
router.put('/:id', profesorController.actualizarProfesor); // Actualizar un profesor
router.delete('/:id', profesorController.eliminarProfesor); // Eliminar un profesor

module.exports = router;
