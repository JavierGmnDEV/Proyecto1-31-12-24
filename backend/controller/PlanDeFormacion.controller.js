const PlanDeFormacion = require('../models/PlanDeFormacion.model');
const Actividades = require('../models/Actividades.model');
const Estudiante = require('../models/Estudiante.model');

// Obtener todos los planes de formación
const obtenerPlanesDeFormacion = async (req, res) => {
  try {
    const planes = await PlanDeFormacion.findAll();
    res.json(planes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los planes de formación' });
  }
};

// Obtener un plan de formación por ID
const obtenerPlanDeFormacionPorId = async (req, res) => {
  try {
    const plan = await PlanDeFormacion.findOne({
      where: {
       Estudiante_ID : req.params.id
      },
      include: [
        {
          model: Actividades,
          as: 'actividades'
        }
      ]
    });
    if (!plan) return res.status(404).json({ error: 'Plan de formación no encontrado' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el plan de formación' });
  }
};

// Crear un nuevo plan de formación
const crearPlanDeFormacion = async (req, res) => {
  try {
    const plan = await PlanDeFormacion.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el plan de formación' });
  }
};

// Actualizar un plan de formación
const actualizarPlanDeFormacion = async (req, res) => {
  try {
    const [updated] = await PlanDeFormacion.update(req.body, { where: { PlanDeFormacion_ID: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Plan de formación no encontrado' });
    res.json({ message: 'Plan de formación actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el plan de formación' });
  }
};
const obtenerPlanDeFormacionPorCentroYAño = async (req, res) => {
    const { centroId, anio } = req.params;
  
    try {
      const planesDeFormacion = await PlanDeFormacion.findAll({
        where: {
          Centro_ID: centroId,
          Año_Dirigido: anio
        },
        include: [
          {
            model: Actividades,
            as: 'actividades'
          }
        ]
      });
  
      if (!planesDeFormacion || planesDeFormacion.length === 0) {
        return res.status(404).json({ error: 'No se encontraron planes de formación para el centro y año especificados.' });
      }
  
      res.status(200).json(planesDeFormacion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los planes de formación para el centro y año especificados.' });
    }
  };

  // Crear un plan de formación individual para un estudiante
const crearPlanDeFormacionParaEstudiante = async (req, res) => {
    const { estudianteId } = req.params;
    const { añoDirigido, profesorId, centroId } = req.body;
  
    try {
      // Verificar si el estudiante existe
      const estudiante = await Estudiante.findByPk(estudianteId);
      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
  
      // Crear el nuevo plan de formación
      const nuevoPlan = await PlanDeFormacion.create({
        Año_Dirigido: añoDirigido,
        Profesor_ID: profesorId,
        Centro_ID: centroId,
        Estudiante_ID: estudianteId
      });
  
      res.status(201).json(nuevoPlan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el plan de formación para el estudiante.' });
    }
  };


// Eliminar un plan de formación y sus actividades asociadas
const eliminarPlanDeFormacion = async (req, res) => {
  const transaction = await PlanDeFormacion.sequelize.transaction();
  try {
    await Actividades.destroy({ where: { PlanDeFormacion_ID: req.params.id }, transaction });
    const deleted = await PlanDeFormacion.destroy({ where: { PlanDeFormacion_ID: req.params.id }, transaction });
    if (!deleted) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Plan de formación no encontrado' });
    }
    await transaction.commit();
    res.json({ message: 'Plan de formación y sus actividades asociadas eliminados' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: 'Error al eliminar el plan de formación' });
  }
};

module.exports = {
    obtenerPlanDeFormacionPorCentroYAño,
  obtenerPlanesDeFormacion,
  obtenerPlanDeFormacionPorId,
  crearPlanDeFormacion,
  actualizarPlanDeFormacion,
  eliminarPlanDeFormacion,
  crearPlanDeFormacionParaEstudiante,
};
