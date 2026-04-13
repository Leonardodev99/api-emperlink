import Notification from '../models/Notification.js';

class NotificationController {

  // 📌 Listar notificações (do próprio utilizador)
  async index(req, res) {
    try {
      const user_id = req.userId; // 🔐 do token

      const notifications = await Notification.findAll({
        where: { user_id },
        order: [['created_at', 'DESC']]
      });

      return res.json(notifications);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar notificações'
      });
    }
  }

  // 📌 Marcar como lida
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      const notification = await Notification.findByPk(id);

      if (!notification) {
        return res.status(404).json({
          error: 'Notificação não encontrada'
        });
      }

      // 🔐 só o dono pode marcar
      if (notification.user_id !== user_id) {
        return res.status(403).json({
          error: 'Sem permissão'
        });
      }

      await notification.update({ is_read: true });

      return res.json({
        message: 'Notificação marcada como lida',
        notification
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao atualizar notificação'
      });
    }
  }

  // 📌 Marcar todas como lidas
  async markAllAsRead(req, res) {
    try {
      const user_id = req.userId; // 🔐

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
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao atualizar notificações'
      });
    }
  }

  // 📌 Remover notificação
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      const notification = await Notification.findByPk(id);

      if (!notification) {
        return res.status(404).json({
          error: 'Notificação não encontrada'
        });
      }

      // 🔐 só o dono pode apagar
      if (notification.user_id !== user_id) {
        return res.status(403).json({
          error: 'Sem permissão'
        });
      }

      await notification.destroy();

      return res.json({
        message: 'Notificação removida com sucesso'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao remover notificação'
      });
    }
  }

}

export default new NotificationController();
