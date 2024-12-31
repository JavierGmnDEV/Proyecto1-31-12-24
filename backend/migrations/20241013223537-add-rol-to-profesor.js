'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Profesor', 'rol', {
      type: Sequelize.STRING(255), // Puedes ajustar el tipo según lo que necesites
      allowNull: false,
      defaultValue: 'docente' // Establece un valor por defecto si lo necesitas
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Profesor', 'rol');
  }
};
