import Sequelize, { Model } from 'sequelize';

export default class GroupMember extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },

        role: {
          type: Sequelize.ENUM('member', 'admin'),
          defaultValue: 'member'
        }

      },
      {
        sequelize,
        tableName: 'group_members',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Group, { foreignKey: 'group_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}
