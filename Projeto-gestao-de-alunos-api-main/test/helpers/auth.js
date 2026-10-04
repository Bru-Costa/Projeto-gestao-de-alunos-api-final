import request from 'supertest';
import app from '../../src/app.js';
import { config } from './config.js';

// Função base: faz POST /api/auth/login e devolve token e dados do usuário.
async function login(email, senha) {
  const res = await request(app).post('/api/auth/login').send({ email, senha });

  if (res.status !== 200 || !res.body.token) {
    throw new Error(
      `Falha no login de ${email}: status ${res.status} - ${JSON.stringify(res.body)}`
    );
  }
  return { token: res.body.token, usuario: res.body.usuario };
}

// Helper 1: login do administrador (credenciais vêm do .env).
export async function loginAdmin() {
  const { token } = await login(config.admin.email, config.admin.senha);
  return token;
}

// Helper 2: login do aluno (credenciais vêm do cenário do arquivo JSON).
export async function loginAluno(email, senha) {
  const { token } = await login(email, senha);
  return token;
}
