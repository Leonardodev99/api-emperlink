import Sequelize, { Model } from 'sequelize';

export default class Group extends Model {
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
          validate: {
            len: {
              args: [3, 100],
              msg: 'O nome do grupo deve ter entre 3 e 100 caracteres'
            }
          }
        },

        description: {
          type: Sequelize.TEXT,
          allowNull: true
        }

      },
      {
        sequelize,
        tableName: 'groups',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'creator_id', as: 'creator' });
    this.hasMany(models.GroupMember, { foreignKey: 'group_id' });
  }
}
