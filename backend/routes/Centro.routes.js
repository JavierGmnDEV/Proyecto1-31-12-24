const express = require('express');
const router = express.Router();
const centroController = require('../controller/Centro.controller');

// Rutas para Centros
router.get('/', centroController.obtenerCentros); // Obtener todos los centros
router.get('/:id', centroController.obtenerCentroPorId); // Obtener un centro por ID
router.post('/', centroController.crearCentro); // Crear un nuevo centro
router.put('/:id', centroController.actualizarCentro); // Actualizar un centro
router.delete('/:id', centroController.eliminarCentro); // Eliminar un centro

module.exports = router;
