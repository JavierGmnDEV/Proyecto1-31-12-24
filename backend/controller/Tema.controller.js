const Tema = require('../models/Tema.model');
const Clase = require('../models/Clase.model');

// Obtener todos los temas con sus clases asociadas
const obtenerTemas = async (req, res) => {
  try {
    const temas = await Tema.findAll({
      include: { model: Clase, as: 'clases' },
    });
    res.status(200).json(temas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los temas.' });
  }
};

// Obtener un tema por ID con sus clases asociadas
const obtenerTemaPorId = async (req, res) => {
  try {
    const tema = await Tema.findByPk(req.params.id, {
      include: { model: Clase, as: 'clases' },
    });

    if (!tema) {
      return res.status(404).json({ error: 'Tema no encontrado.' });
    }

    res.status(200).json(tema);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el tema.' });
  }
};

// Crear un nuevo tema
const crearTema = async (req, res) => {
  try {
    const nuevoTema = await Tema.create(req.body);
    res.status(201).json(nuevoTema);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el tema.' });
  }
};

// Actualizar un tema
const actualizarTema = async (req, res) => {
  try {
    const [updated] = await Tema.update(req.body, { where: { Tema_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Tema no encontrado.' });
    }

    res.status(200).json({ message: 'Tema actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el tema.' });
  }
};

// Eliminar un tema
const eliminarTema = async (req, res) => {
  try {
    const deleted = await Tema.destroy({ where: { Tema_ID: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Tema no encontrado.' });
    }

    res.status(200).json({ message: 'Tema eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el tema.' });
  }
};





module.exports = {
  obtenerTemas,
  obtenerTemaPorId,
  crearTema,
  actualizarTema,
  eliminarTema,
 
};
