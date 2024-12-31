const Estudiante = require('../models/Estudiante.model');
const Entrega = require('../models/Entrega.model');
const Asistencia = require('../models/Asistencia.model');
const Nota = require('../models/Notas.model');

// Obtener todos los estudiantes con sus relaciones (Entregas, Asistencias y Notas) esto es para admin profesor y estudiantes
const obtenerEstudiantes = async (req, res) => {
  try {
    const { centroId, anio } = req.query;

    let estudiantes;

    if (centroId && anio) {
      // Si vienen centroId y anio en la query, filtra los estudiantes
      estudiantes = await Estudiante.findAll({
        where: {
          Centro_ID: centroId,
          Año: anio

        }
      });
    } else {
      // Si no vienen, devuelve todos los estudiantes
      estudiantes = await Estudiante.findAll();
    }

    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los estudiantes.' });
  }
};

// Obtener todos los estudiantes con sus relaciones (Asistencias) arreglar por annp y centro del profesor 
const obtenerTodosEstudiantesconAsistencia = async (req, res) => {
  // Obtenemos los filtros de req.query

  try {
    // Obtener estudiantes del mismo centro y año, junto con sus asistencias
    const estudiantes = await Estudiante.findAll({

      include: { model: Asistencia, as: 'asistencias' }
    });

    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los estudiantes y asistencias.' });
  }
};
// Obtener todos los estudiantes con sus relaciones (Asistencias) arreglar por annp y centro del profesor y del estudiante 
const obtenerTodosEstudiantesconNotas = async (req, res) => {
  // Obtenemos los filtros de req.query

  try {
    // Obtener estudiantes del mismo centro y año, junto con sus asistencias
    const estudiantes = await Estudiante.findAll({

      include: {
        model: Nota,
        as: 'notas',

      }
    });

    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los estudiantes y asistencias.' });
  }
};
// Obtener todos los estudiantes con sus relaciones (Asistencias) arreglar por annp y centro del profesor y del estudiante
const obtenerEstudiantesconAsistencia = async (req, res) => {
  const { centroId, anio } = req.query;  // Obtenemos los filtros de req.query

  try {
    // Obtener estudiantes del mismo centro y año, junto con sus asistencias
    const estudiantes = await Estudiante.findAll({
      where: { Centro_ID: centroId, Año: anio },
      include: { model: Asistencia, as: 'asistencias' }
    });

    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los estudiantes y asistencias.' });
  }
};
// Obtener todos los estudiantes con sus notas  por annp y centro del profesor
const obtenerEstudiantesconNotas = async (req, res) => {
  const { centroId, anio } = req.query; // Obtener centro y año desde req.query

  try {
    // Obtener estudiantes del centro y año especificados
    const estudiantes = await Estudiante.findAll({
      where: { Centro_ID: centroId, Año: anio },
      include: {
        model: Nota,
        as: 'notas',

      }
    });

    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los estudiantes y sus notas.', error });
  }
};




// Obtener un estudiante por ID con sus relaciones (Entregas, Asistencias y Notas) **************todos sin el id
const obtenerEstudiantePorId = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id);

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    res.status(200).json(estudiante);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el estudiante.' });
  }
};

// Crear un nuevo estudiante
const crearEstudiante = async (req, res) => {
  try {
    const nuevoEstudiante = await Estudiante.create(req.body);
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el estudiante.', error });
  }
};

// Actualizar un estudiante
const actualizarEstudiante = async (req, res) => {
  try {
    const [updated] = await Estudiante.update(req.body, { where: { Estudiante_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    res.status(200).json({ message: 'Estudiante actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estudiante.' });
  }
};

// Eliminar un estudiante eliminar sus notas entregas y asistencias
const eliminarEstudiante = async (req, res) => {
  const transaction = await Estudiante.sequelize.transaction(); // Iniciar una transacción

  try {
    // Obtener el estudiante por ID
    const estudiante = await Estudiante.findByPk(req.params.id, { transaction });
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    // Eliminar las notas, entregas y asistencias del estudiante
    await Nota.destroy({ where: { Estudiante_ID: req.params.id }, transaction });
    await Entrega.destroy({ where: { Estudiante_ID: req.params.id }, transaction });
    await Asistencia.destroy({ where: { Estudiante_ID: req.params.id }, transaction });

    // Eliminar el estudiante
    await Estudiante.destroy({ where: { Estudiante_ID: req.params.id }, transaction });

    // Confirmar la transacción
    await transaction.commit();

    res.status(200).json({ message: 'Estudiante y sus registros eliminados correctamente.' });
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    res.status(500).json({ error: 'Error al eliminar el estudiante.' });
  }
};


// Obtener estudiante por nombre
const obtenerEstudiantePorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;

    // Buscar el estudiante por nombre
    const estudiante = await Estudiante.findOne({
      where: { Nombres: nombre },
    });

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    res.status(200).json(estudiante);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el estudiante por nombre.' });
  }
};


module.exports = {
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  obtenerEstudiantePorNombre,
  obtenerEstudiantesconAsistencia,
  obtenerEstudiantesconNotas,
  obtenerTodosEstudiantesconAsistencia,
  obtenerTodosEstudiantesconNotas
};
