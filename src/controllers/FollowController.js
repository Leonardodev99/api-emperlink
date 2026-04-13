import Follow from '../models/Follow.js';
import User from '../models/User.js';
import NotificationService from '../services/NotificationService.js';

class FollowController {

  // 📌 Seguir utilizador
  async follow(req, res) {
    try {
      const follower_id = req.userId; // 🔐 vem do token
      const { following_id } = req.body;

      if (follower_id === following_id) {
        return res.status(400).json({
          error: 'Não pode seguir a si mesmo'
        });
      }

      const following = await User.findByPk(following_id);

      if (!following) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      const alreadyFollowing = await Follow.findOne({
        where: { follower_id, following_id }
      });

      if (alreadyFollowing) {
        return res.status(400).json({
          error: 'Já está a seguir este utilizador'
        });
      }

      const follow = await Follow.create({
        follower_id,
        following_id
      });

      // 🔔 NOTIFICAÇÃO
      await NotificationService.send({
        user_id: following_id,
        type: 'new_follower',
        reference_id: follower_id
      });

      return res.status(201).json({
        message: 'Agora está a seguir este utilizador',
        follow
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao seguir utilizador'
      });
    }
  }
  // 📌 Deixar de seguir
  async unfollow(req, res) {
    try {
      const follower_id = req.userId;
      const { following_id } = req.body;

      const follow = await Follow.findOne({
        where: { follower_id, following_id }
      });

      if (!follow) {
        return res.status(404).json({
          error: 'Relação de follow não encontrada'
        });
      }

      await follow.destroy();

      return res.json({
        message: 'Deixou de seguir o utilizador'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao deixar de seguir'
      });
    }
  }

  // 📌 Listar seguidores
  async followers(req, res) {
    try {
      const user_id = req.userId;

      const followers = await Follow.findAll({
        where: { following_id: user_id },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id', 'name', 'profile_image']
          }
        ]
      });

      return res.json(followers);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar seguidores'
      });
    }
  }

  // 📌 Listar quem o utilizador segue
  async following(req, res) {
    try {
      const user_id = req.userId;

      const following = await Follow.findAll({
        where: { follower_id: user_id },
        include: [
          {
            model: User,
            as: 'following',
            attributes: ['id', 'name', 'profile_image']
          }
        ]
      });

      return res.json(following);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar following'
      });
    }
  }

  // 📌 Verificar se segue
  async checkFollow(req, res) {
    try {
      const follower_id = req.userId;
      const { following_id } = req.params;

      const follow = await Follow.findOne({
        where: { follower_id, following_id }
      });

      return res.json({
        following: !!follow
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao verificar follow'
      });
    }
  }

}

export default new FollowController();
