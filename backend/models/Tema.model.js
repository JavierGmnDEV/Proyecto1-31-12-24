
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const PlanDeClase = require('./PlanDeClase.model');

class Tema extends Model {}

Tema.init({
  Tema_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Plan_Clase_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: PlanDeClase,
      key: 'Plan_Clase_ID',
    },
  },
  Nombre_Tema: {
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
  modelName: 'Tema',
  tableName: 'Tema',
  timestamps: false,
});

// Relación: Un Tema pertenece a un Plan de Clases

   // Definir la relación de Tema con Clase y PlanDeClase

   Tema.associate = (models) => {

       Tema.belongsTo(models.PlanDeClase, { foreignKey: 'Plan_Clase_ID', as: 'PlanDeClase' });
       Tema.hasMany(models.Clase, { foreignKey: 'Tema_ID', as: 'clases' });  // Aquí es donde se define la relación con Clase
};



module.exports = Tema;
