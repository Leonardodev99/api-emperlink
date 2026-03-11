import Sequelize, { Model } from 'sequelize';

export default class PostImage extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },

        image_url: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isUrl: {
              msg: 'URL da imagem inválida'
            }
          }
        }

      },
      {
        sequelize,
        tableName: 'post_images',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {

    this.belongsTo(models.Post, {
      foreignKey: 'post_id',
      as: 'images'
    });

  }
}
