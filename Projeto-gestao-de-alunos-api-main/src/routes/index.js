import { Router } from 'express';
import adminRoutes from './admin/index.js';
import alunoRoutes from './aluno.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

// Rota pública de autenticação.
router.use('/auth', authRoutes);

router.use('/admin', adminRoutes);
router.use('/alunos', alunoRoutes);

export default router;
