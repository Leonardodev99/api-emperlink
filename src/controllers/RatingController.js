import Rating from '../models/Rating.js';
import User from '../models/User.js';

class RatingController {

  // ⭐ Criar avaliação
  async store(req, res) {
    try {

      const { reviewer_id, reviewed_id, rating, comment } = req.body;

      if (reviewer_id === reviewed_id) {
        return res.status(400).json({
          error: 'Não podes avaliar a ti próprio'
        });
      }

      const reviewer = await User.findByPk(reviewer_id);
      const reviewed = await User.findByPk(reviewed_id);

      if (!reviewer || !reviewed) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      const ratingCreated = await Rating.create({
        reviewer_id,
        reviewed_id,
        rating,
        comment
      });

      return res.status(201).json(ratingCreated);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📊 Listar avaliações de um utilizador
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
      return res.status(500).json({
        error: 'Erro ao listar avaliações'
      });
    }
  }

  // ⭐ Média das avaliações
  async average(req, res) {
    try {

      const { user_id } = req.params;

      const ratings = await Rating.findAll({
        where: { reviewed_id: user_id }
      });

      if (ratings.length === 0) {
        return res.json({
          average: 0,
          total: 0
        });
      }

      const total = ratings.length;

      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);

      const average = sum / total;

      return res.json({
        average: average.toFixed(2),
        total
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao calcular média'
      });
    }
  }

  // ✏️ Atualizar avaliação
  async update(req, res) {
    try {

      const { id } = req.params;

      const rating = await Rating.findByPk(id);

      if (!rating) {
        return res.status(404).json({
          error: 'Avaliação não encontrada'
        });
      }

      await rating.update(req.body);

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

  // 🗑 Apagar avaliação
  async delete(req, res) {
    try {

      const { id } = req.params;

      const rating = await Rating.findByPk(id);

      if (!rating) {
        return res.status(404).json({
          error: 'Avaliação não encontrada'
        });
      }

      await rating.destroy();

      return res.json({
        message: 'Avaliação removida'
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao remover avaliação'
      });
    }
  }

}

export default new RatingController();
