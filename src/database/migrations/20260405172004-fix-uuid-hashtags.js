'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // ⚠️ Remove FK antiga, se existir
    await queryInterface.removeConstraint('post_hashtags', 'post_hashtags_ibfk_2');

    // ⚠️ Cria FK correta com tipos compatíveis
    await queryInterface.addConstraint('post_hashtags', {
      fields: ['hashtag_id'],
      type: 'foreign key',
      name: 'post_hashtags_ibfk_2',
      references: {
        table: 'hashtags',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // ⚠️ Reverter: remove FK
    await queryInterface.removeConstraint('post_hashtags', 'post_hashtags_ibfk_2');
  }
};
