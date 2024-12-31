
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Administracion extends Model {}

Administracion.init({
  Administracion_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Usuario: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Administracion',
  tableName: 'Administracion',
  timestamps: false,
});

module.exports = Administracion;
