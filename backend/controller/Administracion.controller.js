const Administracion = require('../models/Administracion.model');

// Obtener todos los registros de administración
const obtenerAdministracion = async (req, res) => {
  try {
    const administracion = await Administracion.findAll();
    res.status(200).json(administracion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros de administración.' });
  }
};

// Obtener administración por ID
const obtenerAdministracionPorId = async (req, res) => {
  try {
    const administracion = await Administracion.findByPk(req.params.id);

    if (!administracion) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    res.status(200).json(administracion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el registro.' });
  }
};

// Crear un nuevo registro
const crearAdministracion = async (req, res) => {
  try {
    const nuevaAdministracion = await Administracion.create(req.body);
    res.status(201).json(nuevaAdministracion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro de administración.' });
  }
};

// Actualizar un registro
const actualizarAdministracion = async (req, res) => {
  try {
    const [updated] = await Administracion.update(req.body, { where: { Administracion_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    res.status(200).json({ message: 'Registro actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el registro.' });
  }
};

// Eliminar un registro
const eliminarAdministracion = async (req, res) => {
  try {
    const deleted = await Administracion.destroy({ where: { Administracion_ID: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    res.status(200).json({ message: 'Registro eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro.' });
  }
};

module.exports = {
  obtenerAdministracion,
  obtenerAdministracionPorId,
  crearAdministracion,
  actualizarAdministracion,
  eliminarAdministracion,
};
