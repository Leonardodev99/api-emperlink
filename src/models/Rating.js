import Sequelize, { Model } from 'sequelize';

export default class Rating extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },

        rating: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 5
          }
        },

        comment: {
          type: Sequelize.TEXT
        }

      },
      {
        sequelize,
        tableName: 'ratings',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {

    this.belongsTo(models.User, {
      foreignKey: 'reviewer_id',
      as: 'reviewer'
    });

    this.belongsTo(models.User, {
      foreignKey: 'reviewed_id',
      as: 'reviewed'
    });

  }
}
