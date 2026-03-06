'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reactions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      post_id: {
        type: Sequelize.UUID,
        references: {
          model: 'posts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      type: {
        type: Sequelize.ENUM('like', 'love', 'clap'),
        defaultValue: 'like'
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
    await queryInterface.dropTable('reactions');
  }
};
