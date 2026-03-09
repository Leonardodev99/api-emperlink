import Notification from '../models/Notification.js';
import User from '../models/User.js';

class NotificationController {

  // 📌 Criar notificação
  async store(req, res) {
    try {
      const { user_id, type, reference_id } = req.body;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      const notification = await Notification.create({
        user_id,
        type,
        reference_id
      });

      return res.status(201).json(notification);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📌 Listar notificações de um utilizador
  async index(req, res) {
    try {
      const { user_id } = req.params;

      const notifications = await Notification.findAll({
        where: { user_id },
        order: [['created_at', 'DESC']]
      });

      return res.json(notifications);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar notificações'
      });
    }
  }

  // 📌 Marcar notificação como lida
  async markAsRead(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findByPk(id);

      if (!notification) {
        return res.status(404).json({
          error: 'Notificação não encontrada'
        });
      }

      await notification.update({
        is_read: true
      });

      return res.json({
        message: 'Notificação marcada como lida',
        notification
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao atualizar notificação'
      });
    }
  }

  // 📌 Marcar todas notificações como lidas
  async markAllAsRead(req, res) {
    try {
      const { user_id } = req.params;

      await Notification.update(
        { is_read: true },
        {
          where: { user_id }
        }
      );

      return res.json({
        message: 'Todas notificações marcadas como lidas'
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao atualizar notificações'
      });
    }
  }

  // 📌 Remover notificação
  async delete(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findByPk(id);

      if (!notification) {
        return res.status(404).json({
          error: 'Notificação não encontrada'
        });
      }

      await notification.destroy();

      return res.json({
        message: 'Notificação removida com sucesso'
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao remover notificação'
      });
    }
  }

}

export default new NotificationController();
