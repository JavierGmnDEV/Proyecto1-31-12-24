const Entrega = require('../models/Entrega.model');

// Obtener todas las entregas
const obtenerEntregas = async (req, res) => {
  try {
    const entregas = await Entrega.findAll();
    res.status(200).json(entregas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las entregas.' });
  }
};

// Obtener una entrega  arreglar y obtener todas las entregas de una evaluacion , de un centro y un anno especifico*******************
const obtenerEntregaPorId = async (req, res) => {
  try {
    const entrega = await Entrega.findByPk(req.params.id);

    if (!entrega) {
      return res.status(404).json({ error: 'Entrega no encontrada.' });
    }

    res.status(200).json(entrega);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la entrega.' });
  }
};

// Crear una nueva entrega
const crearEntrega = async (req, res) => {
  try {
    const nuevaEntrega = await Entrega.create(req.body);
    res.status(201).json(nuevaEntrega);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la entrega.' });
  }
};

// Actualizar una entrega
const actualizarEntrega = async (req, res) => {
  try {
    const [updated] = await Entrega.update(req.body, { where: { Entrega_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Entrega no encontrada.' });
    }

    res.status(200).json({ message: 'Entrega actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la entrega.' });
  }
};

// Eliminar una entrega
const eliminarEntrega = async (req, res) => {
  try {
    const deleted = await Entrega.destroy({ where: { Entrega_ID: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Entrega no encontrada.' });
    }

    res.status(200).json({ message: 'Entrega eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la entrega.' });
  }
};

module.exports = {
  obtenerEntregas,
  obtenerEntregaPorId,
  crearEntrega,
  actualizarEntrega,
  eliminarEntrega,
};
