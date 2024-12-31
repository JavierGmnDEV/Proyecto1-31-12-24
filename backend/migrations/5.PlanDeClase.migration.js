'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlanDeClase', {
      Plan_Clase_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Año_Dirigido: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('PlanDeClase');
  }
};
