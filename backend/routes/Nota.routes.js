const express = require('express');
const router = express.Router();
const notaController = require('../controller/Nota.controller');

// Rutas para Notas
router.get('/', notaController.obtenerNotas); // Obtener todas las notas
router.get('/:id', notaController.obtenerNotaPorId); // Obtener una nota por ID
router.post('/', notaController.crearNota); // Crear una nueva nota
router.put('/', notaController.actualizarNota); // Actualizar una nota
router.delete('/:id', notaController.eliminarNota); // Eliminar una nota

// Ruta adicional: Buscar notas por nombre del estudiante
router.get('/nota/:nombre', notaController.obtenerNotasPorNombreEstudiante);

module.exports = router;
