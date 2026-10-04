import { Router } from 'express';
import alunosRoutes from './alunos.routes.js';
import disciplinasRoutes from './disciplinas.routes.js';
import notasRoutes from './notas.routes.js';
import trabalhosRoutes from './trabalhos.routes.js';
import authenticate from '../../middlewares/authenticate.js';
import authorize from '../../middlewares/authorize.js';

const router = Router();

// Todas as rotas administrativas exigem um token válido de administrador.
router.use(authenticate, authorize('admin'));

router.use('/alunos', alunosRoutes);
router.use('/disciplinas', disciplinasRoutes);
router.use('/notas', notasRoutes);
router.use('/trabalhos', trabalhosRoutes);

export default router;
