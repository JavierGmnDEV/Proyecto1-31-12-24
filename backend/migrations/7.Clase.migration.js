'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clase', {
      Clase_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Tema_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tema',
          key: 'Tema_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Asunto: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Fecha: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Descripcion: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Lugar: {
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
    await queryInterface.dropTable('Clase');
  }
};
