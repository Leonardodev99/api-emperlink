import Post from '../models/Post.js';
import User from '../models/User.js';
import PostImage from '../models/PostImage.js';
import Comment from '../models/Comment.js';
import Reaction from '../models/Reaction.js';
import Hashtag from '../models/Hashtag.js';
import { v4 as uuidv4 } from 'uuid';

class PostController {

  // 📌 Criar post
  async store(req, res) {
    try {

      const extractHashtags = (text) => {
        const matches = text.match(/#([\p{L}\p{N}_]+)/gu);
        return matches ? matches.map(tag => tag.toLowerCase().replace('#', '')) : [];
      };

      const user_id = req.userId; // 🔐 vem do token
      const { content } = req.body;

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

      // 📸 imagens
      if (req.files && req.files.length > 0) {
        const images = req.files.map(file => ({
          post_id: post.id,
          image_url: file.filename
        }));

        await PostImage.bulkCreate(images);
      }

      // 🔥 HASHTAGS
      const hashtags = extractHashtags(content);

      if (hashtags.length > 0) {
        const hashtagInstances = [];

        for (const tag of hashtags) {
          let hashtag = await Hashtag.findOne({ where: { name: tag } });

          if (!hashtag) {
            hashtag = await Hashtag.create({
              id: uuidv4(),
              name: tag
            });
          }

          hashtagInstances.push(hashtag);
        }

        await post.addHashtags(hashtagInstances);
      }

      return res.status(201).json({
        message: 'Post criado com sucesso',
        post
      });

    } catch (error) {
      console.log(error);
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
            model: Hashtag,
            as: 'hashtags',
            attributes: ['id', 'name'],
            through: { attributes: [] } // remove tabela pivot da resposta
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
      console.log(error);
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
            model: Hashtag,
            as: 'hashtags',
            attributes: ['id', 'name'],
            through: { attributes: [] } // remove tabela pivot da resposta
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
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao buscar post'
      });
    }
  }

  // 📌 Listar posts de um utilizador
  async postsByUser(req, res) {
    try {
      const user_id = req.userId;

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
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar posts do utilizador'
      });
    }
  }

  // 📌 Atualizar post
  async update(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      const post = await Post.findByPk(id);

      if (!post) {
        return res.status(404).json({
          error: 'Post não encontrado'
        });
      }

      if (post.user_id !== user_id) {
        return res.status(403).json({
          error: 'Sem permissão para editar este post'
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
      const user_id = req.userId;

      const post = await Post.findByPk(id);

      if (!post) {
        return res.status(404).json({
          error: 'Post não encontrado'
        });
      }

      if (post.user_id !== user_id) {
        return res.status(403).json({
          error: 'Sem permissão para remover este post'
        });
      }

      await post.destroy();

      return res.json({
        message: 'Post removido com sucesso'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao remover post'
      });
    }
  }

  async postsByHashtag(req, res) {
    try {
      const { name } = req.params;

      // normalizar
      const hashtagName = name.toLowerCase();

      const hashtag = await Hashtag.findOne({
        where: { name: hashtagName },
        include: [
          {
            model: Post,
            as: 'posts',
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
                model: Reaction,
                as: 'reactions'
              }
            ],
            through: { attributes: [] }
          }
        ]
      });

      if (!hashtag) {
        return res.status(404).json({
          error: 'Hashtag não encontrada'
        });
      }

      return res.json({
        hashtag: hashtag.name,
        total_posts: hashtag.posts.length,
        posts: hashtag.posts
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao buscar posts por hashtag'
      });
    }
  }

}

export default new PostController();
