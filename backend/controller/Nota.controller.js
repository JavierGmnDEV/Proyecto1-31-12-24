const Nota = require('../models/Notas.model');

// Obtener todas las notas
const obtenerNotas = async (req, res) => {
  try {
    const notas = await Nota.findAll();
    res.status(200).json(notas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las notas.' });
  }
};

// Obtener una nota por ID
const obtenerNotaPorId = async (req, res) => {
  try {
    const nota = await Nota.findByPk(req.params.id);

    if (!nota) {
      return res.status(404).json({ error: 'Nota no encontrada.' });
    }

    res.status(200).json(nota);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la nota.' });
  }
};

// Crear una nueva nota
const crearNota = async (req, res) => {
  try {
    const nuevaNota = await Nota.create(req.body);
    res.status(201).json(nuevaNota);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la nota.' });
  }
};

// Actualizar una nota
const actualizarNota = async (req, res) => {
  const { estudianteId, NotaId } = req.query; // Obtenemos el ID del estudiante y de la asistencia desde req.query

  try {
    // Actualizar el estado de Nota directamente en la base de datos
    const [updated] = await Nota.update(
      { Nota : req.body.Nota }, // Asignamos el valor del campo Nota desde el cuerpo de la petición
      {
        where: {
          Nota_ID: NotaId,
          Estudiante_ID: estudianteId
        }
      }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Nota no encontrada para el estudiante especificado.' });
    }

    res.status(200).json({ message: 'Nota actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la Nota.', details: error });
  }
};

// Eliminar una nota
const eliminarNota = async (req, res) => {
  try {
    const deleted = await Nota.destroy({ where: { Nota_ID: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Nota no encontrada.' });
    }

    res.status(200).json({ message: 'Nota eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la nota.' });
  }
};


// Obtener notas por nombre del estudiante
const obtenerNotasPorNombreEstudiante = async (req, res) => {
    try {
      const { nombre } = req.params;
  
      // Buscar el estudiante por nombre
      const estudiante = await Estudiante.findOne({
        where: { Nombres: nombre },
      });
  
      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado.' });
      }
  
      // Obtener las notas del estudiante encontrado
      const notas = await Nota.findAll({
        where: { Estudiante_ID: estudiante.Estudiante_ID },
      });
  
      if (notas.length === 0) {
        return res.status(404).json({ error: 'No se encontraron notas para el estudiante.' });
      }
  
      res.status(200).json(notas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las notas por nombre del estudiante.' });
    }
  };
  

module.exports = {
  obtenerNotas,
  obtenerNotaPorId,
  crearNota,
  actualizarNota,
  eliminarNota,
  obtenerNotasPorNombreEstudiante,
};
