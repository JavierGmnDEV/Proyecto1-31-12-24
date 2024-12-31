const Centro = require('../models/Centro.model');
const Profesor = require('../models/Profesor.model');
const Estudiante = require('../models/Estudiante.model');

// Obtener todos los centros con sus relaciones (Profesores y Estudiantes)
const obtenerCentros = async (req, res) => {
  try {
    const centros = await Centro.findAll({
      include: [
        { model: Profesor, as: 'profesores' },
        { model: Estudiante, as: 'estudiantes' },
      ],
    });
    res.status(200).json(centros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los centros.' });
  }
};

// Obtener un centro por ID con sus relaciones (Profesores y Estudiantes)
const obtenerCentroPorId = async (req, res) => {
  try {
    const centro = await Centro.findByPk(req.params.id);

    if (!centro) {
      return res.status(404).json({ error: 'Centro no encontrado.' });
    }

    res.status(200).json(centro);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el centro.' });
  }
};

// Crear un nuevo centro
const crearCentro = async (req, res) => {
  try {
    const nuevoCentro = await Centro.create(req.body);
    res.status(201).json(nuevoCentro);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el centro.' });
  }
};

// Actualizar un centro
const actualizarCentro = async (req, res) => {
  try {
    const [updated] = await Centro.update(req.body, { where: { Centro_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Centro no encontrado.' });
    }

    res.status(200).json({ message: 'Centro actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el centro.' });
  }
};


// Eliminar un centro
const eliminarCentro = async (req, res) => {
  try {
    const deleted = await Centro.destroy({ where: { Centro_ID: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Centro no encontrado.' });
    }

    res.status(200).json({ message: 'Centro eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el centro.' });
  }
};

module.exports = {
  obtenerCentros,
  obtenerCentroPorId,
  crearCentro,
  actualizarCentro,
  eliminarCentro,
};
