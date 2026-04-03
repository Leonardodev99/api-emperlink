import Profile from '../models/Profile.js';
import User from '../models/User.js';

class ProfileController {

  // 📌 Criar perfil
  async store(req, res) {
    try {
      const { user_id } = req.body;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      const profile = await Profile.create(req.body);

      return res.status(201).json(profile);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📌 Listar perfis
  async index(req, res) {
    try {
      const profiles = await Profile.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'user_type']
          }
        ]
      });

      return res.json(profiles);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar perfis'
      });
    }
  }

  // 📌 Buscar perfil por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      const profile = await Profile.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'user_type']
          }
        ]
      });

      if (!profile) {
        return res.status(404).json({
          error: 'Perfil não encontrado'
        });
      }

      return res.json(profile);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao buscar perfil'
      });
    }
  }

  // 📌 Buscar perfil por utilizador
  async showByUser(req, res) {
    try {
      const { user_id } = req.params;

      const profile = await Profile.findOne({
        where: { user_id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'user_type']
          }
        ]
      });

      if (!profile) {
        return res.status(404).json({
          error: 'Perfil não encontrado'
        });
      }

      return res.json(profile);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao buscar perfil'
      });
    }
  }

  // 📌 Atualizar perfil
  async update(req, res) {
    try {
      const { id } = req.params;

      const profile = await Profile.findByPk(id);

      if (!profile) {
        return res.status(404).json({
          error: 'Perfil não encontrado'
        });
      }

      await profile.update(req.body);

      return res.json({
        message: 'Perfil atualizado com sucesso',
        profile
      });

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  async uploadAvatar(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: 'Nenhum ficheiro enviado'
        });
      }

      user.avatar = req.file.filename;

      await user.save();

      return res.json({
        message: 'Avatar atualizado com sucesso',
        avatar: user.avatar
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao fazer upload'
      });
    }
  }

  // 📌 Remover perfil
  async delete(req, res) {
    try {
      const { id } = req.params;

      const profile = await Profile.findByPk(id);

      if (!profile) {
        return res.status(404).json({
          error: 'Perfil não encontrado'
        });
      }

      await profile.destroy();

      return res.json({
        message: 'Perfil removido com sucesso'
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao remover perfil'
      });
    }
  }

}

export default new ProfileController();
