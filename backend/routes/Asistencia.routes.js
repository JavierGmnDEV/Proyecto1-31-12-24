const express = require('express');
const router = express.Router();
const asistenciaController = require('../controller/Asistencia.controller');

// Rutas para Asistencia
router.get('/', asistenciaController.obtenerAsistencias); // Obtener todas las asistencias
router.get('/:id', asistenciaController.obtenerAsistenciaPorId); // Obtener una asistencia por ID
router.post('/', asistenciaController.crearAsistencia); // Crear una nueva asistencia
router.put('/', asistenciaController.actualizarAsistencia); // Actualizar una asistencia
router.delete('/', asistenciaController.eliminarAsistencia); // Eliminar una asistencia

// Ruta adicional: Buscar asistencia por nombre del estudiante
router.get('/Asistencia/:nombre', asistenciaController.obtenerAsistenciaPorNombreEstudiante);

module.exports = router;
