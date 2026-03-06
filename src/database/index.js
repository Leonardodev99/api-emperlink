import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';
import User from '../models/User';


const models = [User];

const connection = new Sequelize(databaseConfig);

// Inicializa todos os models
models.forEach((model) => model.init(connection));

// Cria associações
models.forEach((model) => {
  if (model.associate) {
    model.associate({ User });
  }
});

export { connection, User };
