const { Op } = require('sequelize');
const Asistencia = require('../models/Asistencia.model');
const Estudiante = require('../models/Estudiante.model');

// Obtener todas las asistencias es solo para probar 
const obtenerAsistencias = async (req, res) => {
  try {
    const asistencias = await Asistencia.findAll();
    res.status(200).json(asistencias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asistencias.' });
  }
};

// Obtener una asistencia por ID arreglar y que sea por estudiante esto esta de mas porque esta hecho en el controller de estudiantes 
const obtenerAsistenciaPorId = async (req, res) => {
  try {
    const asistencia = await Asistencia.findByPk(req.params.id);

    if (!asistencia) {
      return res.status(404).json({ error: 'Asistencia no encontrada.' });
    }

    res.status(200).json(asistencia);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la asistencia.' });
  }
};

// Crear una nueva asistencia para todos los estudiantes del mismo centro y año que el profesor cree una asistencia
const crearAsistencia = async (req, res) => {
  const transaction = await Asistencia.sequelize.transaction(); // Iniciar una transacción
  try {
    // Obtener año y centro desde los parámetros de la query
    const { anio, centro } = req.query;
    console.log(anio, centro);
    
    // Validar que se hayan pasado correctamente el año y el centro
    if (!anio || !centro) {
      return res.status(400).json({ error: 'El año y el centro son requeridos.' });
    }

    // Obtener todos los estudiantes que coincidan con el centro y el año proporcionados en la query
    const estudiantes = await Estudiante.findAll({
      where: {
        Centro_ID: centro, // Filtrar por el centro proporcionado en la query
        Año: anio // Filtrar por el año proporcionado en la query
      }
    });

    // Validar si no hay estudiantes encontrados
    if (estudiantes.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'No se encontraron estudiantes para este año y centro.' });
    }

    // Crear una asistencia para cada estudiante
    const asistenciaPromises = estudiantes.map(estudiante => {
      return Asistencia.create({
        Estudiante_ID: estudiante.Estudiante_ID,
        Asistencia: req.body.Asistencia, // O lo que corresponda del cuerpo de la solicitud
        Fecha: req.body.Fecha || new Date(), // O asignar una fecha actual si lo prefieres
      }, { transaction });
    });
      console.log(req.body.Fecha);
    // Esperar a que todas las asistencias sean creadas
    await Promise.all(asistenciaPromises);

    // Confirmar la transacción
    await transaction.commit();

    res.status(201).json({ message: 'Asistencias creadas correctamente.' });
  } catch (error) {
    // Revertir la transacción en caso de error
    console.log(error);
    await transaction.rollback();
    res.status(500).json({ error: 'Error al crear las asistencias.' });
  }
};



// Actualizar una asistencia de un estudiante especifico seleccionado en la tabla de estudiantes por el profesor
const actualizarAsistencia = async (req, res) => {
  const { estudianteId, asistenciaId } = req.query; // Obtenemos el ID del estudiante y de la asistencia desde req.query

  try {
    // Actualizar el estado de asistencia directamente en la base de datos
    const [updated] = await Asistencia.update(
      { Asistencia: req.body.Asistencia }, // Asignamos el valor del campo Asistencia desde el cuerpo de la petición
      {
        where: {
          Asistencia_ID: asistenciaId,
          Estudiante_ID: estudianteId
        }
      }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Asistencia no encontrada para el estudiante especificado.' });
    }

    res.status(200).json({ message: 'Asistencia actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la asistencia.', details: error });
  }
};


// Eliminar una asistencia ***************************************************
const eliminarAsistencia = async (req, res) => {
  const transaction = await Asistencia.sequelize.transaction(); // Iniciar una transacción
  try {
    // Obtener año y centro del profesor desde los parámetros de la query
    const { anio, centro } = req.query;

    // Validar que se hayan pasado correctamente el año y el centro
    if (!anio || !centro) {
      return res.status(400).json({ error: 'El año y el centro son requeridos en los parámetros.' });
    }

    // Obtener la fecha desde el cuerpo de la solicitud
    const { Fecha } = req.body;

    // Validar que se haya pasado correctamente la fecha en el cuerpo
    if (!Fecha) {
      return res.status(400).json({ error: 'La fecha es requerida en el cuerpo.' });
    }

    // Obtener todos los estudiantes que coincidan con el centro y el año proporcionados en la query
    const estudiantes = await Estudiante.findAll({
      where: {
        Centro_ID: centro, // Filtrar por el centro proporcionado en la query
        Año: anio // Filtrar por el año proporcionado en la query
      }
    });

    // Validar si no hay estudiantes encontrados
    if (estudiantes.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'No se encontraron estudiantes para este año y centro.' });
    }

    // Obtener los IDs de los estudiantes para eliminarlos en bloque
    const estudiantesIds = estudiantes.map(estudiante => estudiante.Estudiante_ID);

    // Eliminar las asistencias para los estudiantes encontrados en la fecha proporcionada
    await Asistencia.destroy({
      where: {
        Estudiante_ID: {
          [Op.in]: estudiantesIds, // Asegurarse de usar Op.in para manejar arrays de IDs
        },
        Fecha: Fecha // Filtrar por la fecha proporcionada en el body
      },
      transaction
    });

    // Confirmar la transacción
    await transaction.commit();

    res.status(200).json({ message: 'Asistencias eliminadas correctamente para todos los estudiantes del centro y año.' });
  } catch (error) {
    // Revertir la transacción en caso de error
    console.log(error);
    await transaction.rollback();
    res.status(500).json({ error: 'Error al eliminar las asistencias para los estudiantes.' });
  }
};

// Obtener asistencia por nombre del estudiante
const obtenerAsistenciaPorNombreEstudiante = async (req, res) => {
    try {
      const { nombre } = req.params;
  
      // Buscar el estudiante por nombre
      const estudiante = await Estudiante.findOne({
        where: { Nombres: nombre },
      });
  
      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado.' });
      }
  
      // Obtener la asistencia del estudiante encontrado
      const asistencias = await Asistencia.findAll({
        where: { Estudiante_ID: estudiante.Estudiante_ID },
      });
  
      if (asistencias.length === 0) {
        return res.status(404).json({ error: 'No se encontraron registros de asistencia para el estudiante.' });
      }
  
      res.status(200).json(asistencias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la asistencia por nombre del estudiante.' });
    }
  };
  


module.exports = {
  obtenerAsistencias,
  obtenerAsistenciaPorId,
  crearAsistencia,
  actualizarAsistencia,
  eliminarAsistencia,
  obtenerAsistenciaPorNombreEstudiante,
};
