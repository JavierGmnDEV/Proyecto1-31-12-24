const express = require('express');
const router = express.Router();
const evaluacionController = require('../controller/Evaluacion.controller');

// Rutas para Evaluaciones
router.post('/', evaluacionController.crearEvaluacion); // Crear una nueva evaluación
router.get('/', evaluacionController.obtenerEvaluaciones); // Obtener todas las evaluaciones
router.get('/:id', evaluacionController.obtenerEvaluacionPorId); // Obtener una evaluación por ID
router.put('/:id', evaluacionController.actualizarEvaluacion); // Actualizar una evaluación
router.delete('/:id', evaluacionController.eliminarEvaluacion); // Eliminar una evaluación

module.exports = router;
