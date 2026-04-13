export default function roleMiddleware(...rolesPermitidos) {
  return (req, res, next) => {

    if (!req.userRole) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      });
    }

    if (!rolesPermitidos.includes(req.userRole)) {
      return res.status(403).json({
        error: 'Acesso negado: perfil sem permissão'
      });
    }

    return next();
  };
}
