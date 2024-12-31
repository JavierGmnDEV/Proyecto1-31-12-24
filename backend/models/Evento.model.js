
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Profesor = require('./Profesor.model');

class Evento extends Model {}

Evento.init({
  Evento_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Profesor_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: Profesor,
      key: 'Profesor_ID',
    },
  },
  Nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Año_Dirigido: {
    type: DataTypes.INTEGER,
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
}, {
  sequelize,
  modelName: 'Evento',
  tableName: 'Evento',
  timestamps: false,
});

// Relación: Un Evento pertenece a un Profesor
Evento.associate = (models) => {
    Evento.belongsTo(models.Profesor, { foreignKey: 'Profesor_ID', as: 'profesor' });
};
  
module.exports = Evento;
