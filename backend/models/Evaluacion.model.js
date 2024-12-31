
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Profesor = require('./Profesor.model');

class Evaluacion extends Model { }

Evaluacion.init({
    Evaluacion_ID: {
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
    Tipo_Evaluacion: {
        type: DataTypes.ENUM('Entrega', 'Presencial'),
        allowNull: false,
    },
    Tema_A_Evaluar: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Año_Dirigido: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Fecha_Evaluacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Evaluacion',
    tableName: 'Evaluacion',
    timestamps: false,
});

// Relación: Una Evaluación pertenece a un Profesor

// Relación: Una Evaluación tiene muchas Entregas y Notas

Evaluacion.associate = (models) => {
    Evaluacion.belongsTo(models.Profesor, { foreignKey: 'Profesor_ID', as: 'profesor' });
    Evaluacion.hasMany(models.Nota, { foreignKey: 'Evaluacion_ID', as: 'notas' });
    Evaluacion.hasMany(models.Entrega, { foreignKey: 'Evaluacion_ID', as: 'entregas' });

};
module.exports = Evaluacion;
