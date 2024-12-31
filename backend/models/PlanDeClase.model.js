// PlanDeClase.model.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Profesor = require('./Profesor.model');
const Centro = require('./Centro.model');

class PlanDeClase extends Model {}

PlanDeClase.init({
  Plan_Clase_ID: {
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
  },
}, {
  sequelize,
  modelName: 'PlanDeClase',
  tableName: 'PlanDeClase',
  timestamps: false,
});

// Relaciones
PlanDeClase.associate = (models) => {
  PlanDeClase.belongsTo(models.Profesor, { foreignKey: 'Profesor_ID', as: 'profesor' });
  PlanDeClase.belongsTo(models.Centro, { foreignKey: 'Centro_ID', as: 'centro' });
  PlanDeClase.hasMany(models.Tema, { foreignKey: 'Plan_Clase_ID', as: 'temas' });
};

module.exports = PlanDeClase;
