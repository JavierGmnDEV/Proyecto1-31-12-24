const express = require('express');
const router = express.Router();
const estudianteController = require('../controller/Estudiante.controller');
// Rutas para Estudiantes
router.get('/', estudianteController.obtenerEstudiantes); // Obtener todos los estudiantes
router.get('/Asistencia/Todos', estudianteController.obtenerTodosEstudiantesconAsistencia); 
router.get('/Notas/Todos', estudianteController.obtenerTodosEstudiantesconNotas); 
router.get('/Asistencia', estudianteController.obtenerEstudiantesconAsistencia);// Obtener todos los estudiantes con asistencia
router.get('/Notas', estudianteController.obtenerEstudiantesconNotas); // Obtener todos los estudiantes con asistencia
router.get('/:id', estudianteController.obtenerEstudiantePorId); // Obtener un estudiante por ID
router.post('/', estudianteController.crearEstudiante); // Crear un nuevo estudiante
router.put('/:id', estudianteController.actualizarEstudiante); // Actualizar un estudiante
router.delete('/:id', estudianteController.eliminarEstudiante); // Eliminar un estudiante
//por si acaso
router.get('/:nombre', estudianteController.obtenerEstudiantePorNombre);
module.exports = router;
