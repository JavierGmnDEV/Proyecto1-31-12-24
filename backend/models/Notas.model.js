
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Estudiante = require('./Estudiante.model');
const Evaluacion = require('./Evaluacion.model');

class Nota extends Model {}

Nota.init({
  Nota_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Estudiante_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: Estudiante,
      key: 'Estudiante_ID',
    },
  },
  Evaluacion_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: Evaluacion,
      key: 'Evaluacion_ID',
    },
  },
  Nota: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
  },
  Nombre_Evaluacion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Nota',
  tableName: 'Nota',
  timestamps: false,
});

// Relación: Una Nota pertenece a un Estudiante y a una Evaluación
Nota.associate = (models) => {
    Nota.belongsTo(models.Estudiante, { foreignKey: 'Estudiante_ID', as: 'estudiante' });
    Nota.belongsTo(models.Evaluacion, { foreignKey: 'Evaluacion_ID', as: 'evaluacion' });
};

module.exports = Nota;
