'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Evaluacion', {
      Evaluacion_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Profesor_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Profesor',
          key: 'Profesor_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Tipo_Evaluacion: {
        type: Sequelize.ENUM('Entrega', 'Presencial'),
        allowNull: false
      },
      Tema_A_Evaluar: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Año_Dirigido: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Fecha_Evaluacion: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.dropTable('Evaluacion');
  }
};
