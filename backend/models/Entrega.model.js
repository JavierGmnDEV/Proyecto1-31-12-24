
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Estudiante = require('./Estudiante.model');
const Evaluacion = require('./Evaluacion.model');

class Entrega extends Model {}

Entrega.init({
  Entrega_ID: {
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
  Tema_Dirigido: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Archivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Comentarios: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Entrega',
  tableName: 'Entrega',
  timestamps: false,
});

// Relación: Una Entrega pertenece a un Estudiante y a una Evaluación
Entrega.associate = (models) => {
    Entrega.belongsTo(models.Estudiante, { foreignKey: 'Estudiante_ID', as: 'estudiante' });
    Entrega.belongsTo(models.Evaluacion, { foreignKey: 'Evaluacion_ID', as: 'evaluacion' });
};

module.exports = Entrega;
