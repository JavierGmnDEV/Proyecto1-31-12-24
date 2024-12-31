
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Centro = require('./Centro.model');

class Profesor extends Model {}

Profesor.init({
  Profesor_ID: {
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
  Centro_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Centro,
      key: 'Centro_ID',
    },
  },
  Año: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Nombres: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Apellidos: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Rol: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'docente', // Valor por defecto
  },
}, {
  sequelize,
  modelName: 'Profesor',
  tableName: 'Profesor',
  timestamps: false,
});

// Relación: Un Profesor pertenece a un Centro
Profesor.associate = (models) => {
    Profesor.belongsTo(models.Centro, { foreignKey: 'Centro_ID', as: 'centro' });
    Profesor.hasMany(models.PlanDeClase, { foreignKey: 'Profesor_ID', as: 'planesDeClase' });
    Profesor.hasMany(models.Evento, { foreignKey: 'Profesor_ID', as: 'eventos' });
    Profesor.hasMany(models.Evaluacion, { foreignKey: 'Profesor_ID', as: 'evaluaciones' });
};



module.exports = Profesor;
