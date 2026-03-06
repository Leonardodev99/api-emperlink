import Sequelize, { Model } from 'sequelize';

export default class Message extends Model {
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
              args: [1, 2000],
              msg: 'Mensagem inválida'
            }
          }
        },

        is_read: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }

      },
      {
        sequelize,
        tableName: 'messages',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {

    this.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender'
    });

    this.belongsTo(models.User, {
      foreignKey: 'receiver_id',
      as: 'receiver'
    });

  }
}
