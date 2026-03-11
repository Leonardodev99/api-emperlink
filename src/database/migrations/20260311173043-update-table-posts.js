'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'group_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('posts', 'group_id');
  }
};
