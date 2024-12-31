'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Entrega', {
      Entrega_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Estudiante_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Estudiante',
          key: 'Estudiante_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Evaluacion_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Evaluacion',
          key: 'Evaluacion_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Tema_Dirigido: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Archivo: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Comentarios: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Entrega');
  }
};
