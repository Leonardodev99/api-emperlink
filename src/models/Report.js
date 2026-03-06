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
              args: [5, 1000],
              msg: 'Motivo inválido'
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
    this.belongsTo(models.User, { foreignKey: 'reporter_id', as: 'reporter' });
    this.belongsTo(models.User, { foreignKey: 'reported_user_id', as: 'reported' });
    this.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
  }
}
