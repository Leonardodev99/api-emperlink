'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_images', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      post_id: {
        type: Sequelize.UUID,
        references: {
          model: 'posts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      image_url: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('post_images');
  }
};
