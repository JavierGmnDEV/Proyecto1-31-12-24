
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Tema = require('./Tema.model');

class Clase extends Model {}

Clase.init({
  Clase_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Tema_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: Tema,
      key: 'Tema_ID',
    },
  },
  Asunto: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Lugar: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Clase',
  tableName: 'Clase',
  timestamps: false,
});

// Relación: Una Clase pertenece a un Tema
Clase.associate =(models)=>{

    Clase.belongsTo(models.Tema, { foreignKey: 'Tema_ID', as: 'tema' });
}
  
module.exports = Clase;
