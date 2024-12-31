'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Centro', 'Nombre', {
      type: Sequelize.STRING(255),
      allowNull: false, // Puedes modificar esto si quieres permitir valores nulos
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Centro', 'Nombre');
  }
};
