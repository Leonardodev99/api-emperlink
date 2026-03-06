'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reports', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      reporter_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      reported_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },

      post_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'posts',
          key: 'id'
        }
      },

      reason: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM('pending', 'reviewed', 'resolved'),
        defaultValue: 'pending'
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
    await queryInterface.dropTable('reports');
  }
};
