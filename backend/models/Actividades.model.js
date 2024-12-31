const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const PlanDeFormacion = require('./PlanDeFormacion.model');

class Actividades extends Model {}

Actividades.init({
  Actividades_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  PlanDeFormacion_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: PlanDeFormacion,
      key: 'PlanDeFormacion_ID',
    },
    onDelete: 'CASCADE',
  },
  Nombre_Actividades: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Año_Dirigido: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Actividades',
  tableName: 'Actividades',
  timestamps: false,
});

// Relaciones
Actividades.associate = (models) => {
  Actividades.belongsTo(models.PlanDeFormacion, { foreignKey: 'PlanDeFormacion_ID', as: 'planDeFormacion' });
};

module.exports = Actividades;
