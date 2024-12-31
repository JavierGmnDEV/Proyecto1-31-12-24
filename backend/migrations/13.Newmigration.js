'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear la tabla PlanDeFormacion
    await queryInterface.createTable('PlanDeFormacion', {
      PlanDeFormacion_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Año_Dirigido: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Profesor_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Profesor',  // Nombre de la tabla referenciada
          key: 'Profesor_ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      Centro_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Centro',  // Nombre de la tabla referenciada
          key: 'Centro_ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    // Agregar la columna Estudiante_ID a la tabla PlanDeFormacion
    await queryInterface.addColumn('PlanDeFormacion', 'Estudiante_ID', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Estudiantes',  // Nombre de la tabla referenciada
        key: 'Estudiante_ID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Crear la tabla Actividades
    await queryInterface.createTable('Actividades', {
      Actividades_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PlanDeFormacion_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PlanDeFormacion',  // Nombre de la tabla referenciada
          key: 'PlanDeFormacion_ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      Nombre_Actividades: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      Año_Dirigido: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Descripcion: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar las tablas en orden inverso
    await queryInterface.dropTable('Actividades');
    // Primero eliminar la columna Estudiante_ID de PlanDeFormacion antes de eliminar la tabla
    await queryInterface.removeColumn('PlanDeFormacion', 'Estudiante_ID');
    await queryInterface.dropTable('PlanDeFormacion');
  }
};
