import Rating from '../models/Rating.js';
import User from '../models/User.js';
import { fn, col, literal } from 'sequelize';

class RatingController {

  // ⭐ Criar avaliação
  async store(req, res) {
    try {

      const reviewer_id = req.userId;
      const { reviewed_id, rating, comment } = req.body;

      if (reviewer_id === reviewed_id) {
        return res.status(400).json({
          error: 'Não podes avaliar a ti próprio'
        });
      }

      const reviewed = await User.findByPk(reviewed_id);

      if (!reviewed) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      const alreadyRated = await Rating.findOne({
        where: { reviewer_id, reviewed_id }
      });

      if (alreadyRated) {
        return res.status(400).json({
          error: 'Já avaliou este utilizador'
        });
      }

      const ratingCreated = await Rating.create({
        reviewer_id,
        reviewed_id,
        rating,
        comment
      });

      // 🔄 atualizar reputação
      await User.update(
        {
          reputation: literal(`(
            SELECT AVG(rating) FROM ratings WHERE reviewed_id = '${reviewed_id}'
          )`)
        },
        { where: { id: reviewed_id } }
      );

      return res.status(201).json(ratingCreated);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📊 Listar avaliações
  async index(req, res) {
    try {

      const { user_id } = req.params;

      const ratings = await Rating.findAll({
        where: { reviewed_id: user_id },
        include: [
          {
            model: User,
            as: 'reviewer',
            attributes: ['id', 'name', 'profile_image']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(ratings);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar avaliações'
      });
    }
  }

  // ⭐ Média
  async average(req, res) {
    try {

      const { user_id } = req.params;

      const result = await Rating.findOne({
        where: { reviewed_id: user_id },
        attributes: [
          [fn('AVG', col('rating')), 'average'],
          [fn('COUNT', col('id')), 'total']
        ],
        raw: true
      });

      return res.json({
        average: parseFloat(result.average || 0).toFixed(2),
        total: result.total || 0
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao calcular média'
      });
    }
  }

  // ✏️ Atualizar
  async update(req, res) {
    try {

      const { id } = req.params;
      const user_id = req.userId;

      const rating = await Rating.findByPk(id);

      if (!rating) {
        return res.status(404).json({
          error: 'Avaliação não encontrada'
        });
      }

      if (rating.reviewer_id !== user_id) {
        return res.status(403).json({
          error: 'Sem permissão'
        });
      }

      await rating.update(req.body);

      const reviewed_id = rating.reviewed_id;

      await User.update(
        {
          reputation: literal(`(
            SELECT AVG(rating) FROM ratings WHERE reviewed_id = '${reviewed_id}'
          )`)
        },
        { where: { id: reviewed_id } }
      );

      return res.json({
        message: 'Avaliação atualizada',
        rating
      });

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 🗑 Remover
  async delete(req, res) {
    try {

      const { id } = req.params;
      const user_id = req.userId;

      const rating = await Rating.findByPk(id);

      if (!rating) {
        return res.status(404).json({
          error: 'Avaliação não encontrada'
        });
      }

      if (rating.reviewer_id !== user_id) {
        return res.status(403).json({
          error: 'Sem permissão'
        });
      }

      const reviewed_id = rating.reviewed_id;

      await rating.destroy();

      await User.update(
        {
          reputation: literal(`(
            SELECT AVG(rating) FROM ratings WHERE reviewed_id = '${reviewed_id}'
          )`)
        },
        { where: { id: reviewed_id } }
      );

      return res.json({
        message: 'Avaliação removida'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao remover avaliação'
      });
    }
  }

}

export default new RatingController();
