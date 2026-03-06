'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hashtags', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('hashtags');
  }
};
