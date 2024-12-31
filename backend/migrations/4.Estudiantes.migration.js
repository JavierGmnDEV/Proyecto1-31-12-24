'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Estudiante', {
      Estudiante_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Usuario: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Contraseña: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Centro_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Centro',
          key: 'Centro_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Año: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Nombres: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Apellidos: {
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
    await queryInterface.dropTable('Estudiante');
  }
};
