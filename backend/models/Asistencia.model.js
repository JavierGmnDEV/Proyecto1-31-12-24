

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Estudiante = require('./Estudiante.model');

class Asistencia extends Model {}

Asistencia.init({
  Asistencia_ID: {
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
  Asistencia: {
    type: DataTypes.ENUM('Si', 'No'),
    allowNull: false,
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Asistencia',
  tableName: 'Asistencia',
  timestamps: false,
});

// Relación: Una Asistencia pertenece a un Estudiante
Asistencia.associate = (models) => {
    Asistencia.belongsTo(models.Estudiante, { foreignKey: 'Estudiante_ID', as: 'estudiante' });
};

module.exports = Asistencia;
