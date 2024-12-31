const express = require('express');
const router = express.Router();
const actividadesController = require('../controller/Actividades.controller');

// Rutas para Actividades
router.get('/', actividadesController.obtenerActividades); // Obtener todas las actividades
router.get('/:id', actividadesController.obtenerActividadPorId); // Obtener una actividad por ID
router.post('/', actividadesController.crearActividad); // Crear una nueva actividad
router.post('/actividad', actividadesController.agregarActividadyNota);
router.put('/:id', actividadesController.actualizarActividad); // Actualizar una actividad
router.delete('/:id', actividadesController.eliminarActividad); // Eliminar una actividad

module.exports = router;
