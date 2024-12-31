// Centro.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
class Centro extends Model {}
Centro.init({
  Centro_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },  Lugar: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },  Descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },  Nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },}, {
  sequelize,
  modelName: 'Centro',
  tableName: 'Centro',
  timestamps: false,
});
Centro.associate = (models) => {
  Centro.hasMany(models.Profesor, { foreignKey: 'Centro_ID', as: 'profesores' });
  Centro.hasMany(models.Estudiante, { foreignKey: 'Centro_ID', as: 'estudiantes' });
  Centro.hasMany(models.PlanDeClase, { foreignKey: 'Centro_ID', as: 'planesDeClase' });
};
module.exports = Centro;
