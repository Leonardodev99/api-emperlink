'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
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

      type: {
        type: Sequelize.ENUM(
          'new_follower',
          'new_comment',
          'new_reaction',
          'new_message'
        )
      },

      reference_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('notifications');
  }
};
