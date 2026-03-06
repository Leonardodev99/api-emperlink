'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_hashtags', {
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

      hashtag_id: {
        type: Sequelize.UUID,
        references: {
          model: 'hashtags',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('post_hashtags');
  }
};
