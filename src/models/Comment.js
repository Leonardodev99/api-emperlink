import Sequelize, { Model } from 'sequelize';

export default class Comment extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },

        content: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            len: {
              args: [1, 1000],
              msg: 'Comentário inválido'
            }
          }
        }

      },
      {
        sequelize,
        tableName: 'comments',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    this.belongsTo(models.Post, {
      foreignKey: 'post_id'
    });

  }
}
