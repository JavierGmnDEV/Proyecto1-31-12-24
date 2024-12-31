const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Profesor = require('./Profesor.model');
const Centro = require('./Centro.model');
const Estudiante = require('./Estudiante.model'); // Importar el modelo de Estudiante

class PlanDeFormacion extends Model {}

PlanDeFormacion.init({
  PlanDeFormacion_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Año_Dirigido: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Profesor_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: Profesor,
      key: 'Profesor_ID',
    },
  },
  Centro_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Centro,
      key: 'Centro_ID',
    },
  },
  Estudiante_ID: { // Nueva columna para asociar el plan al estudiante
    type: DataTypes.INTEGER,
    references: {
      model: Estudiante,
      key: 'Estudiante_ID',
    },
  }
}, {
  sequelize,
  modelName: 'PlanDeFormacion',
  tableName: 'PlanDeFormacion', // Ajusta el nombre si es necesario
  timestamps: false,
});

// Relaciones
PlanDeFormacion.associate = (models) => {
  PlanDeFormacion.belongsTo(models.Profesor, { foreignKey: 'Profesor_ID', as: 'profesor' });
  PlanDeFormacion.belongsTo(models.Centro, { foreignKey: 'Centro_ID', as: 'centro' });
  PlanDeFormacion.belongsTo(models.Estudiante, { foreignKey: 'Estudiante_ID', as: 'estudiante' }); // Nueva relación con Estudiante
  PlanDeFormacion.hasMany(models.Actividades, { foreignKey: 'PlanDeFormacion_ID', as: 'actividades' });
};

module.exports = PlanDeFormacion;
