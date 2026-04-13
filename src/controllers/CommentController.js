import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import NotificationService from '../services/NotificationService.js';

class CommentController {

  // 📌 Criar comentário
  async store(req, res) {
    try {
      const user_id = req.userId; // 🔐 vem do token
      const { post_id, content } = req.body;

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

      const comment = await Comment.create({
        user_id,
        post_id,
        content
      });

      // 🔔 NOTIFICAÇÃO AUTOMÁTICA
      if (post.user_id !== user_id) {
        await NotificationService.send({
          user_id: post.user_id,   // dono do post
          type: 'new_comment',
          reference_id: comment.id
        });
      }

      return res.status(201).json(comment);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📌 Listar comentários de um post
  async commentsByPost(req, res) {
    try {
      const { post_id } = req.params;

      const comments = await Comment.findAll({
        where: { post_id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'profile_image']
          }
        ],
        order: [['created_at', 'ASC']]
      });

      return res.json(comments);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar comentários'
      });
    }
  }

  // 📌 Buscar comentário por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      const comment = await Comment.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'profile_image']
          }
        ]
      });

      if (!comment) {
        return res.status(404).json({
          error: 'Comentário não encontrado'
        });
      }

      return res.json(comment);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao buscar comentário'
      });
    }
  }

  // 📌 Atualizar comentário
  async update(req, res) {
    try {
      const { id } = req.params;

      const comment = await Comment.findByPk(id);

      if (!comment) {
        return res.status(404).json({
          error: 'Comentário não encontrado'
        });
      }

      if (comment.user_id !== req.userId && req.userRole !== 'company') {
        return res.status(403).json({
          error: 'Não tem permissão para editar este comentário'
        });
      }

      await comment.update(req.body);

      return res.json({
        message: 'Comentário atualizado com sucesso',
        comment
      });

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📌 Remover comentário
  async delete(req, res) {
    try {
      const { id } = req.params;

      const comment = await Comment.findByPk(id);

      if (!comment) {
        return res.status(404).json({
          error: 'Comentário não encontrado'
        });
      }
      if (comment.user_id !== req.userId && req.userRole !== 'company') {
        return res.status(403).json({
          error: 'Não tem permissão para remover este comentário'
        });
      }
      await comment.destroy();

      return res.json({
        message: 'Comentário removido com sucesso'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao remover comentário'
      });
    }
  }

}

export default new CommentController();
