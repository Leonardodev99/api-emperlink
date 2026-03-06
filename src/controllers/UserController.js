import User from '../models/User.js';

class UserController {

  // 📌 Criar utilizador
  async store(req, res) {
    try {
      const user = await User.create(req.body);

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type
      });
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message)
      });
    }
  }

  // 📌 Listar utilizadores
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'email',
          'user_type',
          'bio',
          'profile_image',
          'location',
          'website',
          'reputation',
          'is_verified'
        ]
      });

      return res.json(users);
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar utilizadores'
      });
    }
  }

  // 📌 Buscar utilizador por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: [
          'id',
          'name',
          'email',
          'user_type',
          'bio',
          'profile_image',
          'location',
          'website',
          'reputation',
          'is_verified'
        ]
      });

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      return res.json(user);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao buscar utilizador'
      });
    }
  }

  // 📌 Atualizar utilizador
  async update(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      await user.update(req.body);

      return res.json({
        message: 'Utilizador atualizado com sucesso',
        user
      });

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map((err) => err.message) || [error.message]
      });
    }
  }

  // 📌 Remover utilizador
  async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      await user.destroy();

      return res.json({
        message: 'Utilizador removido com sucesso'
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao remover utilizador'
      });
    }
  }
}

export default new UserController();
