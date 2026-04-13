import { Op } from 'sequelize';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Follow from '../models/Follow.js';
import GroupMember from '../models/GroupMember.js';
import PostImage from '../models/PostImage.js';
import Hashtag from '../models/Hashtag.js';

class FeedController {

  // 📢 Feed personalizado
  async userFeed(req, res) {
    try {

      //const { user_id } = req.params;
      const user_id = req.userId;
      // utilizadores que o user segue
      const follows = await Follow.findAll({
        where: { follower_id: user_id },
        attributes: ['following_id']
      });

      const followingIds = follows.map(f => f.following_id);

      // incluir o próprio user
      followingIds.push(user_id);

      // posts de pessoas que segue
      const posts = await Post.findAll({

        where: {
          user_id: {
            [Op.in]: followingIds
          }
        },

        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'profile_image']
          },
          {
            model: PostImage,
            as: 'images',
            attributes: ['id', 'image_url']
          },
          {
            model: Hashtag,
            attributes: ['name'],
            through: { attributes: [] }
          }
        ],

        order: [['created_at', 'DESC']],

        limit: 50
      });

      return res.json(posts);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error.message
      });
    }
  }

  // 🌍 Feed global (posts recentes da rede)
  async globalFeed(req, res) {
    try {

      const { page = 1 } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'profile_image']
          },
          {
            model: PostImage,
            as: 'images',
            attributes: ['id', 'image_url']
          },
          {
            model: Hashtag,
            attributes: ['name'],
            through: { attributes: [] }
          }
        ],
        order: [['created_at', 'DESC']],
        limit,
        offset
      });

      return res.json(posts);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error.message
      });
    }
  }

  // 👥 Feed de grupos
  async groupFeed(req, res) {

    try {

      const user_id = req.userId;

      const groups = await GroupMember.findAll({
        where: { user_id },
        attributes: ['group_id']
      });

      const groupIds = groups.map(g => g.group_id);

      const posts = await Post.findAll({
        where: {
          group_id: {
            [Op.in]: groupIds
          }
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'profile_image']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(posts);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error.message
      });
    }
  }

}

export default new FeedController();
