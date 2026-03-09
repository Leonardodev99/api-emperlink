import GroupMember from '../models/GroupMember.js';
import Group from '../models/Group.js';
import User from '../models/User.js';

class GroupMemberController {

  // Entrar num grupo
  async join(req, res) {
    try {

      const { group_id } = req.params;
      const { user_id } = req.body;

      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      const group = await Group.findByPk(group_id);

      if (!group) {
        return res.status(404).json({
          error: 'Grupo não encontrado'
        });
      }

      const memberExists = await GroupMember.findOne({
        where: {
          group_id,
          user_id
        }
      });

      if (memberExists) {
        return res.status(400).json({
          error: 'Utilizador já é membro deste grupo'
        });
      }

      const member = await GroupMember.create({
        group_id,
        user_id,
        role: 'member'
      });

      return res.status(201).json(member);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao entrar no grupo'
      });
    }
  }

  // Sair do grupo
  async leave(req, res) {
    try {

      const { group_id } = req.params;
      const { user_id } = req.body;

      const member = await GroupMember.findOne({
        where: {
          group_id,
          user_id
        }
      });

      if (!member) {
        return res.status(404).json({
          error: 'Utilizador não é membro deste grupo'
        });
      }

      await member.destroy();

      return res.json({
        message: 'Saiu do grupo com sucesso'
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao sair do grupo'
      });
    }
  }

  // Listar membros do grupo
  async members(req, res) {
    try {

      const { group_id } = req.params;

      const members = await GroupMember.findAll({
        where: { group_id },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'profile_image']
          }
        ]
      });

      return res.json(members);

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar membros'
      });
    }
  }

  // Promover membro a admin
  async promote(req, res) {
    try {

      const { group_id } = req.params;
      const { user_id } = req.body;

      const member = await GroupMember.findOne({
        where: {
          group_id,
          user_id
        }
      });

      if (!member) {
        return res.status(404).json({
          error: 'Membro não encontrado'
        });
      }

      await member.update({
        role: 'admin'
      });

      return res.json({
        message: 'Membro promovido a admin',
        member
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao promover membro'
      });
    }
  }

}

export default new GroupMemberController();
