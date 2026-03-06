import Sequelize, { Model } from 'sequelize';

export default class Reaction extends Model {
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
            'like',
            'love',
            'support',
            'insightful'
          ),
          allowNull: false
        }

      },
      {
        sequelize,
        tableName: 'reactions',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {

    this.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    this.belongsTo(models.Post, {
      foreignKey: 'post_id'
    });

  }
}
