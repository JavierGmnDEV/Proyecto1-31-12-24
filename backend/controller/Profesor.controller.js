const Profesor = require('../models/Profesor.model');
const PlanDeClase = require('../models/PlanDeClase.model');
const Evaluacion = require('../models/Evaluacion.model');
const Evento = require('../models/Evento.model');
const Centro = require('../models/Centro.model');

// Obtener todos los profesores con sus relaciones (Planes de Clase, Evaluaciones y Eventos)
const obtenerProfesores = async (req, res) => {
  try {
    const profesores = await Profesor.findAll({
      include: [
        { model: Centro, as: 'centro' },
        
      ],
    });
    res.status(200).json(profesores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los profesores.' });
  }
};
const obtenerProfesoresconTodo = async (req, res) => {
  try {
    const profesores = await Profesor.findAll({
      include: [
        { model: PlanDeClase, as: 'planesDeClase' },
        { model: Evaluacion, as: 'evaluaciones' },
        { model: Evento, as: 'eventos' },
      ],
    });
    res.status(200).json(profesores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los profesores.' });
  }
};

// Obtener un profesor por ID con sus relaciones (Planes de Clase, Evaluaciones y Eventos)
const obtenerProfesorPorId = async (req, res) => {
  try {
    const profesor = await Profesor.findByPk(req.params.id, {
      include: [
        { model: PlanDeClase, as: 'planesDeClase' },
        { model: Evaluacion, as: 'evaluaciones' },
        { model: Evento, as: 'eventos' },
      ],
    });

    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado.' });
    }

    res.status(200).json(profesor);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el profesor.' });
  }
};

// Crear un nuevo profesor 
const crearProfesor = async (req, res) => {
  try {
    const nuevoProfesor = await Profesor.create(req.body);
    res.status(201).json(nuevoProfesor);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el profesor.' });
  }
};

// Actualizar un profesor
const actualizarProfesor = async (req, res) => {
  try {
    const [updated] = await Profesor.update(req.body, { where: { Profesor_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Profesor no encontrado.' });
    }

    res.status(200).json({ message: 'Profesor actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el profesor.' });
  }
};

// Eliminar un profesor
const eliminarProfesor = async (req, res) => {
  try {
    const deleted = await Profesor.destroy({ where: { Profesor_ID: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Profesor no encontrado.' });
    }

    res.status(200).json({ message: 'Profesor eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el profesor.' });
  }
};

module.exports = {
  obtenerProfesores,
  obtenerProfesorPorId,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor,
};
