const express = require('express');
const router = express.Router();
const entregaController = require('../controller/Entrega.controller');

// Rutas para Entregas
router.get('/', entregaController.obtenerEntregas); // Obtener todas las entregas
router.get('/:id', entregaController.obtenerEntregaPorId); // Obtener una entrega por ID
router.post('/', entregaController.crearEntrega); // Crear una nueva entrega
router.put('/:id', entregaController.actualizarEntrega); // Actualizar una entrega
router.delete('/:id', entregaController.eliminarEntrega); // Eliminar una entrega

module.exports = router;
