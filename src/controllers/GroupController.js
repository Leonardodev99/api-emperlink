import Group from '../models/Group.js';
import User from '../models/User.js';

class GroupController {

  // 📌 Criar grupo
  async store(req, res) {
    try {
      const { name, description, creator_id } = req.body;

      const user = await User.findByPk(creator_id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado'
        });
      }

      const group = await Group.create({
        name,
        description,
        creator_id
      });

      return res.status(201).json(group);

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📌 Listar grupos
  async index(req, res) {
    try {
      const groups = await Group.findAll({
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'profile_image']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(groups);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar grupos'
      });
    }
  }

  // 📌 Buscar grupo por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      const group = await Group.findByPk(id, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'profile_image']
          }
        ]
      });

      if (!group) {
        return res.status(404).json({
          error: 'Grupo não encontrado'
        });
      }

      return res.json(group);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao buscar grupo'
      });
    }
  }

  // 📌 Listar grupos criados por um utilizador
  async groupsByUser(req, res) {
    try {
      const { user_id } = req.params;

      const groups = await Group.findAll({
        where: { creator_id: user_id },
        order: [['created_at', 'DESC']]
      });

      return res.json(groups);

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao listar grupos do utilizador'
      });
    }
  }

  // 📌 Atualizar grupo
  async update(req, res) {
    try {
      const { id } = req.params;

      const group = await Group.findByPk(id);

      if (!group) {
        return res.status(404).json({
          error: 'Grupo não encontrado'
        });
      }

      await group.update(req.body);

      return res.json({
        message: 'Grupo atualizado com sucesso',
        group
      });

    } catch (error) {
      return res.status(400).json({
        errors: error.errors?.map(err => err.message) || [error.message]
      });
    }
  }

  // 📌 Remover grupo
  async delete(req, res) {
    try {
      const { id } = req.params;

      const group = await Group.findByPk(id);

      if (!group) {
        return res.status(404).json({
          error: 'Grupo não encontrado'
        });
      }

      await group.destroy();

      return res.json({
        message: 'Grupo removido com sucesso'
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Erro ao remover grupo'
      });
    }
  }

}

export default new GroupController();
