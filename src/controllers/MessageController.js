import Message from '../models/Message.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import { getIO } from '../socket.js';
import NotificationService from '../services/NotificationService.js';

class MessageController {

  // 📌 Enviar mensagem
  async store(req, res) {
    try {

      const { sender_id, receiver_id, content } = req.body;

      const sender = await User.findByPk(sender_id);
      const receiver = await User.findByPk(receiver_id);

      if (!sender) {
        return res.status(404).json({
          error: 'Remetente não encontrado'
        });
      }

      if (!receiver) {
        return res.status(404).json({
          error: 'Destinatário não encontrado'
        });
      }

      const message = await Message.create({
        sender_id,
        receiver_id,
        content
      });

      // 🔥 SOCKET EVENT (tempo real)
      const io = getIO();
      io.to(receiver_id).emit('new_message', message);

      // 🔔 NOTIFICAÇÃO AUTOMÁTICA
      if (sender_id !== receiver_id) {
        await NotificationService.send({
          user_id: receiver_id,     // quem recebe
          type: 'new_message',
          reference_id: message.id  // referência da mensagem
        });
      }

      return res.status(201).json(message);

    } catch (error) {

      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });

    }
  }

  // 📌 Listar conversa entre dois utilizadores
  async conversation(req, res) {
    try {
      const { user1, user2 } = req.params;

      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { sender_id: user1, receiver_id: user2 },
            { sender_id: user2, receiver_id: user1 }
          ]
        },
        order: [['created_at', 'ASC']]
      });

      return res.json(messages);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao carregar conversa'
      });
    }
  }

  // 📌 Inbox (todas conversas do utilizador)
  async inbox(req, res) {
    try {
      const { user_id } = req.params;

      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { sender_id: user_id },
            { receiver_id: user_id }
          ]
        },
        order: [['created_at', 'DESC']]
      });

      return res.json(messages);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao carregar inbox'
      });
    }
  }

  // 📌 Marcar mensagem como lida
  async markAsRead(req, res) {
    try {
      const { id } = req.params;

      const message = await Message.findByPk(id);

      if (!message) {
        return res.status(404).json({
          error: 'Mensagem não encontrada'
        });
      }

      await message.update({
        is_read: true
      });

      return res.json({
        message: 'Mensagem marcada como lida'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao atualizar mensagem'
      });
    }
  }

  // 📌 Remover mensagem
  async delete(req, res) {
    try {
      const { id } = req.params;

      const message = await Message.findByPk(id);

      if (!message) {
        return res.status(404).json({
          error: 'Mensagem não encontrada'
        });
      }

      await message.destroy();

      return res.json({
        message: 'Mensagem removida com sucesso'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao remover mensagem'
      });
    }
  }

}

export default new MessageController();
