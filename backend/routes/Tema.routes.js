const express = require('express');
const router = express.Router();
const temaController = require('../controller/Tema.controller');

// Rutas para Temas
router.get('/', temaController.obtenerTemas); // Obtener todos los temas
router.get('/:id', temaController.obtenerTemaPorId); // Obtener un tema por ID
router.post('/', temaController.crearTema); // Crear un nuevo tema
router.put('/:id', temaController.actualizarTema); // Actualizar un tema
router.delete('/:id', temaController.eliminarTema); // Eliminar un tema

module.exports = router;
