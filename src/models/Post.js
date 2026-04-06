import Sequelize, { Model } from 'sequelize';

export default class Post extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        group_id: {
          type: Sequelize.UUID,
          allowNull: true
        },

        content: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            len: {
              args: [3, 2000],
              msg: 'O post deve ter entre 3 e 2000 caracteres'
            }
          }
        },

        type: {
          type: Sequelize.ENUM('post', 'announcement'),
          defaultValue: 'post'
        },

        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }

      },
      {
        sequelize,
        tableName: 'posts',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'author'
    });

    this.hasMany(models.Comment, {
      foreignKey: 'post_id',
      as: 'comments'
    });

    this.hasMany(models.Reaction, {
      foreignKey: 'post_id',
      as: 'reactions'
    });

    this.hasMany(models.PostImage, {
      foreignKey: 'post_id',
      as: 'images'
    });

    this.belongsToMany(models.Hashtag, {
      through: 'post_hashtags',
      foreignKey: 'post_id',
      as: 'hashtags'
    });

  }
}
