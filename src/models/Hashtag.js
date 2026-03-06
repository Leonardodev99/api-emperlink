import Sequelize, { Model } from 'sequelize';

export default class Hashtag extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            len: {
              args: [2, 50],
              msg: 'Hashtag inválida'
            }
          }
        }

      },
      {
        sequelize,
        tableName: 'hashtags',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {

    this.belongsToMany(models.Post, {
      through: 'post_hashtags',
      foreignKey: 'hashtag_id'
    });

  }
}
