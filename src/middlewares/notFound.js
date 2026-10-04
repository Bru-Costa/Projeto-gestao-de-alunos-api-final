import ApiError from '../utils/ApiError.js';

function notFound(req, res, next) {
  next(new ApiError(404, `Rota não encontrada: ${req.method} ${req.originalUrl}`));
}

export default notFound;
