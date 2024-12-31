'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Asistencia', {
      Asistencia_ID: {
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
      Asistencia: {
        type: Sequelize.ENUM('Si', 'No'),
        allowNull: false
      },
      Fecha: {
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
    await queryInterface.dropTable('Asistencia');
  }
};
