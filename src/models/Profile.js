import Sequelize, { Model } from 'sequelize';

export default class Profile extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },

        phone: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
            is: {
              args: /^[0-9+\-() ]{6,20}$/,
              msg: 'Número de telefone inválido'
            }
          }
        },

        address: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
            len: {
              args: [5, 255],
              msg: 'Endereço deve ter entre 5 e 255 caracteres'
            }
          }
        }

      },
      {
        sequelize,
        tableName: 'profiles',
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}
