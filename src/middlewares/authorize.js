import ApiError from '../utils/ApiError.js';

function authorize(...papeisPermitidos) {
  return (req, res, next) => {
    if (!req.user || !papeisPermitidos.includes(req.user.role)) {
      return next(new ApiError(403, 'Você não tem permissão para acessar este recurso.'));
    }
    next();
  };
}

export default authorize;
