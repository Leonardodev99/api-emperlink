import Sequelize, { Model } from 'sequelize';

export default class PostHashtag extends Model {
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
        tableName: 'post_hashtags',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Post, { foreignKey: 'post_id' });
    this.belongsTo(models.Hashtag, { foreignKey: 'hashtag_id' });
  }
}
