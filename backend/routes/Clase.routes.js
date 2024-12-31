const express = require('express');
const router = express.Router();
const claseController = require('../controller/Clase.controller');

// Rutas para Clases
router.get('/', claseController.obtenerClases); // Obtener todas las clases
router.get('/:id', claseController.obtenerClasePorId); // Obtener una clase por ID
router.post('/', claseController.crearClase); // Crear una nueva clase
router.put('/:id', claseController.actualizarClase); // Actualizar una clase
router.delete('/:id', claseController.eliminarClase); // Eliminar una clase

module.exports = router;
