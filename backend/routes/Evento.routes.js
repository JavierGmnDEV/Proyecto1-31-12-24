const express = require('express');
const router = express.Router();
const eventoController = require('../controller/Evento.controller');

// Rutas para Eventos
router.get('/profesor', eventoController.obtenerEventos); // Obtener todos los eventos
router.get('/', eventoController.obtenerEventosEstudiantes); // Obtener todos los eventos

router.get('/:id', eventoController.obtenerEventoPorId); // Obtener un evento por ID
router.post('/', eventoController.crearEvento); // Crear un nuevo evento
router.put('/:id', eventoController.actualizarEvento); // Actualizar un evento
router.delete('/:id', eventoController.eliminarEvento); // Eliminar un evento

module.exports = router;
