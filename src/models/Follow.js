import Sequelize, { Model } from 'sequelize';

export default class Follow extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        }

      },
      {
        sequelize,
        tableName: 'follows',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {

    this.belongsTo(models.User, {
      foreignKey: 'follower_id',
      as: 'follower'
    });

    this.belongsTo(models.User, {
      foreignKey: 'following_id',
      as: 'following'
    });

  }
}
