import Sequelize, { Model } from 'sequelize';

export default class Report extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },

        reason: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            len: {
              args: [3, 1000],
              msg: 'O motivo deve conter entre 3 e 1000 caracteres.'
            }
          }
        },

        status: {
          type: Sequelize.ENUM('pending', 'reviewed', 'resolved'),
          defaultValue: 'pending'
        }

      },
      {
        sequelize,
        tableName: 'reports',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {
    // Associações:
    this.belongsTo(models.User, { foreignKey: 'reporter_id', as: 'reporter' });
    this.belongsTo(models.User, { foreignKey: 'reported_user_id', as: 'reportedUser' });
    this.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
  }
}
