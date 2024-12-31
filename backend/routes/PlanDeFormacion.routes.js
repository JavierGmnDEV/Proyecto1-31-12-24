const express = require('express');
const router = express.Router();
const planDeFormacionController = require('../controller/PlanDeFormacion.controller');

// Rutas para Plan de Formación
router.get('/', planDeFormacionController.obtenerPlanesDeFormacion); // Obtener todos los planes de formación
router.get('/:id', planDeFormacionController.obtenerPlanDeFormacionPorId); // Obtener un plan de formación por ID
router.get('/centro/:centroId/anio/:anio', planDeFormacionController.obtenerPlanDeFormacionPorCentroYAño); // Obtener planes de formación por centro y año
router.post('/', planDeFormacionController.crearPlanDeFormacion); // Crear un nuevo plan de formación
router.put('/:id', planDeFormacionController.actualizarPlanDeFormacion); // Actualizar un plan de formación
router.delete('/:id', planDeFormacionController.eliminarPlanDeFormacion); // Eliminar un plan de formación
router.post('/estudiante/:estudianteId', planDeFormacionController.crearPlanDeFormacionParaEstudiante); // Nueva ruta para crear un plan individual
module.exports = router;
