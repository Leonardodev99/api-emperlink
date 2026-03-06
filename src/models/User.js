import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [5, 150],
              msg: 'O nome deve ter entre 5 e 150 caracteres'
            },
            isNotStartWithNumber(value) {
              if (/^\d/.test(value)) {
                throw new Error('O nome não pode começar com número');
              }
            }
          }
        },

        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: {
            msg: 'Email já existe'
          },
          validate: {
            isEmail: {
              msg: 'Email inválido'
            }
          }
        },

        password: {
          type: Sequelize.STRING,
          allowNull: false
        },

        user_type: {
          type: Sequelize.ENUM('client', 'entrepreneur', 'company'),
          allowNull: false,
          defaultValue: 'client',
        },

        bio: {
          type: Sequelize.TEXT
        },

        profile_image: {
          type: Sequelize.STRING
        },

        location: {
          type: Sequelize.STRING
        },

        website: {
          type: Sequelize.STRING
        },

        reputation: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
        },

        is_verified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',

        hooks: {
          beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
          },

          beforeUpdate: async (user) => {
            if (user.changed('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          }
        }
      }
    );

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}
