import Notification from '../models/Notification.js';

class NotificationService {

  async send({ user_id, type, reference_id = null }) {
    try {

      const exists = await Notification.findOne({
        where: {
          user_id,
          type,
          reference_id
        }
      });

      if (exists) return;
      return await Notification.create({
        user_id,
        type,
        reference_id
      });
    } catch (error) {
      console.log('Erro ao criar notificação:', error);
    }
  }

}

export default new NotificationService();
