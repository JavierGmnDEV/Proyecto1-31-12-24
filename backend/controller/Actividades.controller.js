const Actividades = require('../models/Actividades.model');
const Evaluacion = require('../models/Evaluacion.model');
const Estudiante = require('../models/Estudiante.model');
const Nota = require('../models/Notas.model');
const { Op } = require('sequelize');
const PlanDeFormacion = require('../models/PlanDeFormacion.model');

// Obtener todas las actividades
const obtenerActividades = async (req, res) => {
  try {
    const actividades = await Actividades.findAll();
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
};

// Obtener una actividad por ID
const obtenerActividadPorId = async (req, res) => {
  try {
    const actividad = await Actividades.findByPk(req.params.id);
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
    res.json(actividad);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la actividad' });
  }
};

// Crear una nueva actividad y evaluación para estudiantes del centro
const crearActividad = async (req, res) => {
  const transaction = await Actividades.sequelize.transaction();
  try {
    const {
      PlanDeFormacion_ID,
      Estudiante_ID,
      Nombre_Actividades,
      Año_Dirigido,
      Descripcion,
      Profesor_ID,
      Tipo_Evaluacion,
      Tema_A_Evaluar,
      Fecha_Evaluacion
    } = req.body;

    // 1. Crear la actividad asociada al Plan de Formación
    const actividad = await Actividades.create(
      {
        PlanDeFormacion_ID,
        Nombre_Actividades,
        Año_Dirigido,
        Descripcion
      },
      { transaction }
    );

    // 2. Crear la evaluación asociada al Profesor y al Año Dirigido
    const evaluacion = await Evaluacion.create(
      {
        Profesor_ID,
        Tipo_Evaluacion,
        Tema_A_Evaluar,
        Año_Dirigido,
        Fecha_Evaluacion
      },
      { transaction }
    );

    // 3. Crear la nota asociada a este Estudiante específico
    await Nota.create(
      {
        Estudiante_ID,
        Evaluacion_ID: evaluacion.Evaluacion_ID,
        Nota: 0,  // Nota inicial o predeterminada
        Nombre_Evaluacion: Nombre_Actividades  // Usamos el nombre de la actividad como nombre de la evaluación
      },
      { transaction }
    );

    // Confirmar la transacción
    await transaction.commit();
    res.status(201).json({ message: 'Actividad, evaluación y nota creadas correctamente para el estudiante' });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error al crear la actividad, evaluación y nota' });
  }
};


// Actualizar una actividad
const actualizarActividad = async (req, res) => {
  try {
    const [updated] = await Actividades.update(req.body, { where: { Actividades_ID: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Actividad no encontrada' });
    res.json({ message: 'Actividad actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la actividad' });
  }
};
//crear una nota para ese estudiante al agregar una actividad
async function agregarActividadyNota(req, res) {
  try {
    const { PlanDeFormacion_ID, Nombre_Actividades, Descripcion, Año_Dirigido } = req.body;

    // Verificar que el plan de formación existe
    const planDeFormacion = await PlanDeFormacion.findByPk(PlanDeFormacion_ID);
    if (!planDeFormacion) {
      return res.status(404).json({ message: 'Plan de formación no encontrado' });
    }

    // Crear la actividad
    const actividad = await Actividades.create({
      PlanDeFormacion_ID,
      Nombre_Actividades,
      Descripcion,
      Año_Dirigido,
    });

    // Crear la nota para el estudiante
    const estudiante = await Estudiante.findByPk(planDeFormacion.Estudiante_ID);

    const nota = await Nota.create({
      Estudiante_ID: estudiante.Estudiante_ID,
      Nota: null,  // Nota vacía inicialmente
      Nombre_Evaluacion: Nombre_Actividad,  // Asignar el nombre de la actividad como nombre de la evaluación
    });

    res.status(201).json({ actividad, nota });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar la actividad o la nota' });
  }
}

// Eliminar una actividad y sus notas asociadas
const eliminarActividad = async (req, res) => {
  const transaction = await Actividades.sequelize.transaction();
  try {
    const actividad = await Actividades.findByPk(req.params.id);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    // Buscar las notas asociadas a la actividad mediante su ID
    const notas = await Nota.findAll({
      where: { Nombre_Evaluacion: actividad.Nombre_Actividades },
      transaction,
    });

    if (notas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron notas asociadas a esta actividad' });
    }

    // Obtener los IDs de las evaluaciones desde las notas
    const evaluacionIds = notas.map(nota => nota.Evaluacion_ID);

    // Eliminar las notas asociadas
    await Nota.destroy({
      where: { Evaluacion_ID: { [Op.in]: evaluacionIds } },
      transaction,
    });

    // Eliminar las evaluaciones asociadas
    await Evaluacion.destroy({
      where: { Evaluacion_ID: { [Op.in]: evaluacionIds } },
      transaction,
    });

    // Eliminar la actividad
    await Actividades.destroy({
      where: { Actividades_ID: req.params.id },
      transaction,
    });

    // Confirmar la transacción
    await transaction.commit();
    res.json({ message: 'Actividad, evaluaciones y notas asociadas eliminadas correctamente' });
  } catch (error) {
    // Revertir transacción en caso de error
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la actividad, evaluaciones o notas' });
  }
};

module.exports = {
    
  obtenerActividades,
  obtenerActividadPorId,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  agregarActividadyNota,
};
