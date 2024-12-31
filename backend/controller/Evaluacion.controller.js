const Evaluacion = require('../models/Evaluacion.model');
const Entrega = require('../models/Entrega.model');
const Estudiante = require('../models/Estudiante.model');
const Nota = require('../models/Notas.model');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
// Obtener todas las evaluaciones con sus entregas asociadas
const obtenerEvaluaciones = async (req, res) => {
  const {id} = req.query
  try {
    const evaluaciones = await Evaluacion.findAll({ where: { Profesor_ID: id }},{
      include: { model: Entrega, as: 'entregas' },
    });
    res.status(200).json(evaluaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las evaluaciones.' });
  }
};

// Obtener una evaluación por ID con sus entregas asociadas*****************obtenerlas por estudiantes del anio y centro del profesor 
const obtenerEvaluacionPorId = async (req, res) => {
  try {
    const evaluacion = await Evaluacion.findByPk(req.params.id, {
      include: { model: Entrega, as: 'entregas' },
    });

    if (!evaluacion) {
      return res.status(404).json({ error: 'Evaluación no encontrada.' });
    }

    res.status(200).json(evaluacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la evaluación.' });
  }
};

// Crear una nueva evaluación 
const crearEvaluacion = async (req, res) => {
  const transaction = await Evaluacion.sequelize.transaction(); // Iniciar una transacción
  try {
    // Obtener año y centro desde los parámetros de la query
    const { anio, centro } = req.query;
    console.log(anio,centro);
    // Validar que se hayan pasado correctamente el año y el centro
    if (!anio || !centro) {
      return res.status(400).json({ error: 'El año y el centro son requeridos.' });
    }

    // Crear la nueva evaluación con los datos del cuerpo de la solicitud
    const nuevaEvaluacion = await Evaluacion.create({
      ...req.body,
      Año_Dirigido: anio, // Asignar el año de la query a la evaluación
    }, { transaction });

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

    
    const notasPromises = estudiantes.map(estudiante => {
      return Nota.create({
        Estudiante_ID: estudiante.Estudiante_ID,
        Evaluacion_ID: nuevaEvaluacion.Evaluacion_ID,
        Nota: 2, // Asignar nota inicial como null
        Nombre_Evaluacion: nuevaEvaluacion.Tema_A_Evaluar
      }, { transaction });
    });

    // Esperar a que todas las notas sean creadas
    await Promise.all(notasPromises);

    // Confirmar la transacción
    await transaction.commit();

    res.status(201).json({ message: 'Evaluación creada y notas asignadas correctamente.' });
  } catch (error) {
    // Revertir la transacción en caso de error
    console.log(error);
    await transaction.rollback();
    res.status(500).json({ error: 'Error al crear la evaluación y asignar las notas.' });
  }
};


// Actualizar una evaluación
const actualizarEvaluacion = async (req, res) => {
  try {
    const [updated] = await Evaluacion.update(req.body, { where: { Evaluacion_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Evaluación no encontrada.' });
    }

    res.status(200).json({ message: 'Evaluación actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la evaluación.' });
  }
};

// Eliminar una evaluación 
const eliminarEvaluacion = async (req, res) => {
  const transaction = await Evaluacion.sequelize.transaction(); // Iniciar transacción

  try {
    const { anio , centro } = req.query; // Obtener los parámetros desde la query
    const evaluacionId = req.params.id;

    // Verificar si los parámetros existen
    if (!centro || !anio) {
      return res.status(400).json({ error: 'Centro y año son requeridos.' });
    }

    // Obtener los IDs de los estudiantes del centro y año proporcionados
    const estudiantes = await Estudiante.findAll({
      where: {
        Centro_ID: centro,
        Año: anio
      },
      attributes: ['Estudiante_ID'] // Solo necesitamos los IDs
    });

    // Si no hay estudiantes que coincidan
    if (estudiantes.length === 0) {
      return res.status(404).json({ error: 'No se encontraron estudiantes para este centro y año.' });
    }

    // Extraer los IDs de los estudiantes
    const estudianteIds = estudiantes.map(est => est.Estudiante_ID);

    // Eliminar las notas de esos estudiantes para la evaluación específica
    await Nota.destroy({
      where: {
        Evaluacion_ID: evaluacionId,
        Estudiante_ID: {
          [Op.in]: estudianteIds
        }
      },
      transaction
    });

    // Eliminar la evaluación
    const deleted = await Evaluacion.destroy({
      where: { Evaluacion_ID: evaluacionId },
      transaction
    });

    if (!deleted) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Evaluación no encontrada.' });
    }

    // Confirmar la transacción si todo ha ido bien
    await transaction.commit();

    res.status(200).json({ message: 'Evaluación y notas asociadas eliminadas correctamente.' });
  } catch (error) {
    console.log('Error:', error);

    // Revertir la transacción en caso de error
    await transaction.rollback();
    res.status(500).json({ error: 'Error al eliminar la evaluación y las notas asociadas.' });
  }
};




module.exports = {
  obtenerEvaluaciones,
  obtenerEvaluacionPorId,
  crearEvaluacion,
  actualizarEvaluacion,
  eliminarEvaluacion,
};
