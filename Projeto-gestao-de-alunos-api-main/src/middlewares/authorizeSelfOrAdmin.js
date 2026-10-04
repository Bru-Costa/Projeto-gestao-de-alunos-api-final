import ApiError from '../utils/ApiError.js';

function authorizeSelfOrAdmin(req, res, next) {
  const { alunoId } = req.params;
  const ehAdmin = req.user?.role === 'admin';
  const ehOProprioAluno = req.user?.role === 'aluno' && req.user.id === alunoId;

  if (!ehAdmin && !ehOProprioAluno) {
    return next(new ApiError(403, 'Você só pode acessar os seus próprios dados.'));
  }
  next();
}

export default authorizeSelfOrAdmin;
