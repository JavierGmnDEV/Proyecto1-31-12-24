const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Centro = require('./Centro.model');
class Estudiante extends Model {}
Estudiante.init({
  Estudiante_ID: {    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },  Usuario: {    type: DataTypes.STRING(255),
    allowNull: false,
  },  Contraseña: {    type: DataTypes.STRING(255),
    allowNull: false,
  },  Centro_ID: {    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Centro,
      key: 'Centro_ID',
    },
  },  Año: {    type: DataTypes.INTEGER,
    allowNull: false,
  },  Nombres: {    type: DataTypes.STRING(255),
    allowNull: false,
  },  Apellidos: {    type: DataTypes.STRING(255),
    allowNull: false,
  },}, {  sequelize,
  modelName: 'Estudiante',
  tableName: 'Estudiante',
  timestamps: false,
});
Estudiante.associate = (models) => {
        Estudiante.belongsTo(models.Centro, { foreignKey: 'Centro_ID', as: 'centro' });
        Estudiante.hasMany(models.Entrega, { foreignKey: 'Estudiante_ID', as: 'entregas' });
        Estudiante.hasMany(models.Nota, { foreignKey: 'Estudiante_ID', as: 'notas' });
        Estudiante.hasMany(models.Asistencia, { foreignKey: 'Estudiante_ID', as: 'asistencias' });
        Estudiante.hasMany(models.PlanDeFormacion, { foreignKey: 'Estudiante_ID', as: 'PlanDeFormacion' });
    };
module.exports = Estudiante;
        