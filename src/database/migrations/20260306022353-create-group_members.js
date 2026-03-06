'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('group_members', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      group_id: {
        type: Sequelize.UUID,
        references: {
          model: 'groups',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      role: {
        type: Sequelize.ENUM('member', 'admin'),
        defaultValue: 'member'
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
    await queryInterface.dropTable('group_members');
  }
};
