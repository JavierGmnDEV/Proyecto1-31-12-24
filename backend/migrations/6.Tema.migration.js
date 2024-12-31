'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tema', {
      Tema_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Plan_Clase_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PlanDeClase',
          key: 'Plan_Clase_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Nombre_Tema: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Año_Dirigido: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Descripcion: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable('Tema');
  }
};
