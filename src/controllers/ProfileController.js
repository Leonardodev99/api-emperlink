import Profile from '../models/Profile.js';
import User from '../models/User.js';

class ProfileController {

  // 📌 Criar perfil
  async store(req, res) {
    try {
      const user_id = req.userId;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      // ❗ Evitar duplicação de perfil
      const existingProfile = await Profile.findOne({
        where: { user_id }
      });

      if (existingProfile) {
        return res.status(400).json({
          error: 'Perfil já existe para este utilizador'
        });
      }

      // 💡 Se a bio veio no body,
      if (req.body.bio !== undefined) {
        user.bio = req.body.bio;
        await user.save();
      }

      // Cria os campos nativos do perfil (phone, address)
      const profile = await Profile.create({
        phone: req.body.phone,
        address: req.body.address,
        user_id
      });

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
      console.log(error);
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
      console.log(error);
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
            attributes: ['id', 'name', 'email', 'user_type', 'avatar']
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
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao buscar perfil'
      });
    }
  }

  // 📌 Buscar perfil do usuário logado (via Token)
  async showSelf(req, res) {
    try {
      const user_id = req.userId;
      console.log('🔐 USER_ID DO TOKEN (showSelf):', user_id);

      const profile = await Profile.findOne({
        where: { user_id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'user_type', 'avatar', 'bio', 'profile_image'] // ✅ Adicione profile_image
          }
        ]
      });

      if (!profile) {
        return res.status(404).json({
          error: 'Perfil não encontrado para este utilizador'
        });
      }

      // 🔍 RETORNE O USER DO PROFILE, NÃO OUTRO UTILIZADOR!
      return res.json({
        id: profile.user.id,
        name: profile.user.name,
        email: profile.user.email,
        user_type: profile.user.user_type,
        avatar: profile.user.avatar,
        bio: profile.user.bio,
        profile_image: profile.user.profile_image,
        phone: profile.phone,
        address: profile.address,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Erro ao obter perfil do utilizador logado'
      });
    }
  }

  // 📌 Atualizar perfil
  async update(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      const profile = await Profile.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });

      if (!profile) {
        return res.status(404).json({
          error: 'Perfil não encontrado'
        });
      }

      // 🔐 Só o dono pode editar
      if (profile.user_id !== user_id) {
        return res.status(403).json({
          error: 'Sem permissão para editar este perfil'
        });
      }

      // 💡 Atualiza a bio no utilizador associado, se enviada
      if (req.body.bio !== undefined && profile.user) {
        await profile.user.update({ bio: req.body.bio });
      }

      // Atualiza os restantes campos na tabela profiles (phone, address)
      await profile.update({
        phone: req.body.phone,
        address: req.body.address
      });

      // Recarrega o perfil com os dados atualizados para devolver ao frontend
      const updatedProfile = await Profile.findByPk(id, {
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'user_type', 'avatar', 'bio'] }]
      });

      return res.json({
        message: 'Perfil atualizado com sucesso',
        profile: updatedProfile
      });

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  async uploadAvatar(req, res) {
    try {
      const user_id = req.userId;

      const user = await User.findByPk(user_id);

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
      const user_id = req.userId;

      const profile = await Profile.findByPk(id);

      if (!profile) {
        return res.status(404).json({
          error: 'Perfil não encontrado'
        });
      }

      if (profile.user_id !== user_id) {
        return res.status(403).json({
          error: 'Sem permissão para remover este perfil'
        });
      }

      await profile.destroy();

      return res.json({
        message: 'Perfil removido com sucesso'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao remover perfil'
      });
    }
  }

}

export default new ProfileController();
