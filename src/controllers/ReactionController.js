import Reaction from '../models/Reaction.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

class ReactionController {

  // Criar reação
  async store(req, res) {
    try {
      const { user_id, post_id, type } = req.body;

      const user = await User.findByPk(user_id);
      const post = await Post.findByPk(post_id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      if (!post) {
        return res.status(404).json({
          error: 'Post não encontrado'
        });
      }

      // verificar se já reagiu
      const existingReaction = await Reaction.findOne({
        where: { user_id, post_id }
      });

      if (existingReaction) {
        await existingReaction.update({ type });

        return res.json({
          message: 'Reação atualizada',
          reaction: existingReaction
        });
      }

      const reaction = await Reaction.create({
        user_id,
        post_id,
        type
      });

      return res.status(201).json(reaction);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // Listar reações de um post
  async reactionsByPost(req, res) {
    try {
      const { post_id } = req.params;

      const reactions = await Reaction.findAll({
        where: { post_id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'profile_image']
          }
        ]
      });

      return res.json(reactions);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar reações'
      });
    }
  }

  // Contagem de reações por tipo
  async countByType(req, res) {
    try {
      const { post_id } = req.params;

      const reactions = await Reaction.findAll({
        where: { post_id },
        attributes: ['type']
      });

      const count = {};

      reactions.forEach((reaction) => {
        count[reaction.type] = (count[reaction.type] || 0) + 1;
      });

      return res.json(count);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao contar reações'
      });
    }
  }

  // Remover reação
  async delete(req, res) {
    try {
      const { id } = req.params;

      const reaction = await Reaction.findByPk(id);

      if (!reaction) {
        return res.status(404).json({
          error: 'Reação não encontrada'
        });
      }

      await reaction.destroy();

      return res.json({
        message: 'Reação removida com sucesso'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao remover reação'
      });
    }
  }
}

export default new ReactionController();
