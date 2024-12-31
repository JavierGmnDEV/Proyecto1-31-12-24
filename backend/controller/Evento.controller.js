const Evento = require('../models/Evento.model');

// Obtener todos los eventos
const obtenerEventos = async (req, res) => {
  const {id} = req.query
  try {
    const eventos = await Evento.findAll({ where: { Profesor_ID: id }});
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los eventos.' });
  }
};
//eventos para estudiantes
const obtenerEventosEstudiantes = async (req, res) => {
  const {anio} = req.query
  try {
    const eventos = await Evento.findAll({ where: { Año_Dirigido: anio }});
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los eventos.' });
  }
};

// Obtener un evento por ID
const obtenerEventoPorId = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado.' });
    }

    res.status(200).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el evento.' });
  }
};

// Crear un nuevo evento
const crearEvento = async (req, res) => {
  try {
    const nuevoEvento = await Evento.create(req.body);
    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el evento.',error });
  }
};

// Actualizar un evento
const actualizarEvento = async (req, res) => {
  try {
    const [updated] = await Evento.update(req.body, { where: { Evento_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Evento no encontrado.' });
    }

    res.status(200).json({ message: 'Evento actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el evento.' });
  }
};

// Eliminar un evento
const eliminarEvento = async (req, res) => {
  try {
    const deleted = await Evento.destroy({ where: { Evento_ID: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Evento no encontrado.' });
    }

    res.status(200).json({ message: 'Evento eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el evento.' });
  }
};

module.exports = {
  obtenerEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  obtenerEventosEstudiantes
};
