import Sequelize, { Model } from 'sequelize';

export default class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
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
        }

      },
      {
        sequelize,
        tableName: 'notifications',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {

    this.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

  }
}
