const express = require('express');
const router = express.Router();
const administracionController = require('../controller/Administracion.controller');

// Rutas para Administración
router.get('/', administracionController.obtenerAdministracion); // Obtener todas las administraciones
router.get('/:id', administracionController.obtenerAdministracionPorId); // Obtener una administración por ID
router.post('/', administracionController.crearAdministracion); // Crear una nueva administración
router.put('/:id', administracionController.actualizarAdministracion); // Actualizar una administración
router.delete('/:id', administracionController.eliminarAdministracion); // Eliminar una administración

module.exports = router;
