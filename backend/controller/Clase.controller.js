const Clase = require('../models/Clase.model');

// Obtener todas las clases
const obtenerClases = async (req, res) => {
  try {
    const clases = await Clase.findAll();
    res.status(200).json(clases);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las clases.' });
  }
};

// Obtener una clase por ID
const obtenerClasePorId = async (req, res) => {
  try {
    const clase = await Clase.findByPk(req.params.id);

    if (!clase) {
      return res.status(404).json({ error: 'Clase no encontrada.' });
    }

    res.status(200).json(clase);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la clase.' });
  }
};

// Crear una nueva clase
const crearClase = async (req, res) => {
  try {
    const nuevaClase = await Clase.create(req.body);
    res.status(201).json(nuevaClase);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la clase.' });
  }
};

// Actualizar una clase
const actualizarClase = async (req, res) => {
  try {
    const [updated] = await Clase.update(req.body, { where: { Clase_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Clase no encontrada.' });
    }

    res.status(200).json({ message: 'Clase actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la clase.' });
  }
};

// Eliminar una clase
const eliminarClase = async (req, res) => {
  try {
    const deleted = await Clase.destroy({ where: { Clase_ID: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Clase no encontrada.' });
    }

    res.status(200).json({ message: 'Clase eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la clase.' });
  }
};

module.exports = {
  obtenerClases,
  obtenerClasePorId,
  crearClase,
  actualizarClase,
  eliminarClase,
};
