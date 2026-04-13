import Report from '../models/Report.js';
import User from '../models/User.js';

class ReportController {

  // Criar denúncia
  async store(req, res) {
    try {

      const reporter_id = req.userId;
      const {
        reported_user_id,
        post_id,
        comment_id,
        reason
      } = req.body;

      const reporter = await User.findByPk(reporter_id);

      if (!reporter) {
        return res.status(404).json({
          error: 'Utilizador que denuncia não encontrado'
        });
      }

      if (reported_user_id) {
        const reportedUser = await User.findByPk(reported_user_id);

        if (!reportedUser) {
          return res.status(404).json({
            error: 'Utilizador denunciado não encontrado'
          });
        }
      }

      const report = await Report.create({
        reporter_id,
        reported_user_id,
        post_id,
        comment_id,
        reason,
        status: 'pending'
      });

      return res.status(201).json(report);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // Listar denúncias (ADMIN)
  async index(req, res) {
    try {

      const reports = await Report.findAll({
        include: [
          {
            model: User,
            as: 'reporter',
            attributes: ['id', 'name']
          },
          {
            model: User,
            as: 'reportedUser',
            attributes: ['id', 'name']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(reports);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar denúncias'
      });
    }
  }

  // Ver denúncia
  async show(req, res) {
    try {

      const { id } = req.params;

      const report = await Report.findByPk(id, {
        include: [
          {
            model: User,
            as: 'reporter',
            attributes: ['id', 'name']
          },
          {
            model: User,
            as: 'reportedUser',
            attributes: ['id', 'name']
          }
        ]
      });

      if (!report) {
        return res.status(404).json({
          error: 'Denúncia não encontrada'
        });
      }

      return res.json(report);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao buscar denúncia'
      });
    }
  }

  // Atualizar estado (ADMIN)
  async updateStatus(req, res) {
    try {

      const { id } = req.params;
      const { status } = req.body;

      const allowedStatus = ['pending', 'reviewed', 'rejected', 'resolved'];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          error: 'Status inválido'
        });
      }

      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          error: 'Denúncia não encontrada'
        });
      }

      await report.update({ status });

      return res.json({
        message: 'Estado da denúncia atualizado',
        report
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao atualizar denúncia'
      });
    }
  }

  // Remover denúncia (ADMIN)
  async delete(req, res) {
    try {

      const { id } = req.params;

      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          error: 'Denúncia não encontrada'
        });
      }

      await report.destroy();

      return res.json({
        message: 'Denúncia removida'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao remover denúncia'
      });
    }
  }

}

export default new ReportController();
