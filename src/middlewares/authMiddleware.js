import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        error: 'Token não enviado'
      });
    }

    const [, token] = authorization.split(' ');

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      const { id, email, user_type } = decoded;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(401).json({
          error: 'Usuário inválido'
        });
      }

      // 🔐 Dados disponíveis na request
      req.userId = id;
      req.userEmail = email;
      req.userRole = user_type;

      return next();

    } catch (err) {
      console.log(err);
      return res.status(401).json({
        error: 'Token inválido ou expirado'
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: 'Erro na autenticação'
    });
  }
};
