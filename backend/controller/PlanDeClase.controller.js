const Clase = require('../models/Clase.model');
const PlanDeClase = require('../models/PlanDeClase.model');
const Tema = require('../models/Tema.model');
const Profesor = require('../models/Profesor.model');


// Obtener todos los planes de clase con sus temas asociados
const obtenerPlanesDeClase = async (req, res) => {
  const {} = req.query
  try {
    const planes = await PlanDeClase.findAll({
      include: { model: Tema, as: 'temas' },
      
    });
    res.status(200).json(planes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los planes de clase.',error });
  }
};

const obtenerPlanDeClaseEstudiante = async (req, res) => {
  const { Centroid } = req.params; // Asumiendo que el ID del profesor viene en los parámetros de la URL

  try {
    // Buscar el plan de clase asociado al ID del profesor
    const planDeClase = await PlanDeClase.findAll({
      where: { Centro_ID: Centroid }, // Filtrar por el ID del profesor
      include: [
        {
          model: Tema,
          as: 'temas',
          include: [
            {
              model: Clase,
              as: 'clases' // Asumiendo que el alias de la relación en el modelo Tema es 'clases'
            }
          ]
        }
      ]
    });

    // Validar si se encontró el plan de clase
    if (!planDeClase) {
      return res.status(404).json({ error: 'No se encontró un plan de clase para el profesor especificado.' });
    }

    // Respuesta exitosa con el plan de clase, sus temas y clases asociadas
    res.status(200).json(planDeClase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el plan de clase del profesor.', details: error });
  }
};


// Obtener el plan de clase de un profesor por su ID con temas y clases asociadas
const obtenerPlanDeClasePorId = async (req, res) => {
  const { profesorId } = req.params; // Asumiendo que el ID del profesor viene en los parámetros de la URL

  try {
    // Buscar el plan de clase asociado al ID del profesor
    const planDeClase = await PlanDeClase.findAll({
      where: { Profesor_ID: profesorId }, // Filtrar por el ID del profesor
      include: [
        {
          model: Tema,
          as: 'temas',
          include: [
            {
              model: Clase,
              as: 'clases' // Asumiendo que el alias de la relación en el modelo Tema es 'clases'
            }
          ]
        }
      ]
    });

    // Validar si se encontró el plan de clase
    if (!planDeClase) {
      return res.status(404).json({ error: 'No se encontró un plan de clase para el profesor especificado.' });
    }

    // Respuesta exitosa con el plan de clase, sus temas y clases asociadas
    res.status(200).json(planDeClase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el plan de clase del profesor.', details: error });
  }
};





// Crear un nuevo plan de clase
const crearPlanDeClase = async (req, res) => {
  try {
    const nuevoPlan = await PlanDeClase.create(req.body);
    res.status(201).json(nuevoPlan);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el plan de clase.' });
  }
};

// Actualizar un plan de clase
const actualizarPlanDeClase = async (req, res) => {
  try {
    const [updated] = await PlanDeClase.update(req.body, { where: { Plan_Clase_ID: req.params.id } });

    if (!updated) {
      return res.status(404).json({ error: 'Plan de clase no encontrado.' });
    }

    res.status(200).json({ message: 'Plan de clase actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el plan de clase.' });
  }
};

// Eliminar un plan de clase
const eliminarPlanDeClase = async (req, res) => {
  try {
    const deleted = await PlanDeClase.destroy({ where: { Plan_Clase_ID: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Plan de clase no encontrado.' });
    }

    res.status(200).json({ message: 'Plan de clase eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el plan de clase.' });
  }
};

module.exports = {
  obtenerPlanesDeClase,
  obtenerPlanDeClasePorId,
  crearPlanDeClase,
  actualizarPlanDeClase,
  eliminarPlanDeClase,
  obtenerPlanDeClaseEstudiante
};
