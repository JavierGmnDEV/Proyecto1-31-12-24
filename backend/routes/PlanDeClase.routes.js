const express = require('express');
const router = express.Router();
const planDeClaseController = require('../controller/PlanDeClase.controller');

// Rutas para Plan de Clase
router.get('/', planDeClaseController.obtenerPlanesDeClase); // Obtener todos los planes de clase

router.get('/:profesorId', planDeClaseController.obtenerPlanDeClasePorId); // Obtener un plan de clase por ID
router.get('/centro/:Centroid', planDeClaseController.obtenerPlanDeClaseEstudiante); // Obtener todos los planes de clase
router.post('/', planDeClaseController.crearPlanDeClase); // Crear un nuevo plan de clase
router.put('/:id', planDeClaseController.actualizarPlanDeClase); // Actualizar un plan de clase
router.delete('/:id', planDeClaseController.eliminarPlanDeClase); // Eliminar un plan de clase

module.exports = router;
