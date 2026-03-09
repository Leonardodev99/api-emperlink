import Post from '../models/Post.js';
import User from '../models/User.js';
import PostImage from '../models/PostImage.js';
import Comment from '../models/Comment.js';
import Reaction from '../models/Reaction.js';

class PostController {

  // 📌 Criar post
  async store(req, res) {
    try {
      const { user_id, content } = req.body;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      const post = await Post.create({
        user_id,
        content
      });

      return res.status(201).json(post);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📌 Listar posts
  async index(req, res) {
    try {
      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'profile_image']
          },
          {
            model: PostImage,
            as: 'images'
          },
          {
            model: Comment,
            as: 'comments'
          },
          {
            model: Reaction,
            as: 'reactions'
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(posts);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar posts'
      });
    }
  }

  // 📌 Buscar post por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'profile_image']
          },
          {
            model: PostImage,
            as: 'images'
          },
          {
            model: Comment,
            as: 'comments'
          },
          {
            model: Reaction,
            as: 'reactions'
          }
        ]
      });

      if (!post) {
        return res.status(404).json({
          error: 'Post não encontrado'
        });
      }

      return res.json(post);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao buscar post'
      });
    }
  }

  // 📌 Listar posts de um utilizador
  async postsByUser(req, res) {
    try {
      const { user_id } = req.params;

      const posts = await Post.findAll({
        where: { user_id },
        include: [
          {
            model: PostImage,
            as: 'images'
          },
          {
            model: Reaction,
            as: 'reactions'
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(posts);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar posts do utilizador'
      });
    }
  }

  // 📌 Atualizar post
  async update(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);

      if (!post) {
        return res.status(404).json({
          error: 'Post não encontrado'
        });
      }

      await post.update(req.body);

      return res.json({
        message: 'Post atualizado com sucesso',
        post
      });

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📌 Remover post
  async delete(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);

      if (!post) {
        return res.status(404).json({
          error: 'Post não encontrado'
        });
      }

      await post.destroy();

      return res.json({
        message: 'Post removido com sucesso'
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao remover post'
      });
    }
  }

}

export default new PostController();
