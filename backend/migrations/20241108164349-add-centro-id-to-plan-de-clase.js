'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Agregar la columna 'Centro_ID' a la tabla 'PlanDeClase' con una clave foránea
    await queryInterface.addColumn('PlanDeClase', 'Centro_ID', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Cambiar a 'true' si deseas que el campo sea opcional
      references: {
        model: 'Centro',  // Nombre de la tabla Centro (debe coincidir con el nombre exacto de la tabla en la base de datos)
        key: 'Centro_ID', // El campo clave primaria en la tabla Centro
      },
      onUpdate: 'CASCADE', // Actualiza la columna 'Centro_ID' si se actualiza la clave primaria en la tabla Centro
      onDelete: 'SET NULL', // Si se elimina un registro de la tabla Centro, se pone a null el campo 'Centro_ID' en 'PlanDeClase'
    });
  },

  async down (queryInterface, Sequelize) {
    // Eliminar la columna 'Centro_ID' de la tabla 'PlanDeClase'
    await queryInterface.removeColumn('PlanDeClase', 'Centro_ID');
  }
};
