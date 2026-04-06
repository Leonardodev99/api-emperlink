import Sequelize, { Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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
        underscored: true,

        // ✅ AGORA ESTÁ CORRETO
        hooks: {
          beforeCreate: (hashtag) => {
            if (!hashtag.id) {
              hashtag.id = uuidv4();
            }
          }
        }
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Post, {
      through: 'post_hashtags',
      foreignKey: 'hashtag_id',
      as: 'posts'
    });
  }
}
