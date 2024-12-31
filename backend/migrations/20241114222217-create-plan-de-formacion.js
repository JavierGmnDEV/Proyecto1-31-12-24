'use strict';

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar la columna Estudiante_ID a la tabla PlanDeFormacion
    await queryInterface.addColumn('PlanDeFormacion', 'Estudiante_ID', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Estudiante',  // Nombre de la tabla referenciada
        key: 'Estudiante_ID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar la columna Estudiante_ID de la tabla PlanDeFormacion
    await queryInterface.removeColumn('PlanDeFormacion', 'Estudiante_ID');
  }
};