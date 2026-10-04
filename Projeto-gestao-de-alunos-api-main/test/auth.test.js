import { readFileSync } from 'node:fs';
import { config } from './helpers/config.js';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { loginAdmin } from './helpers/auth.js';

// Data-Driven Testing: os cenários de login inválido vêm do arquivo JSON.
const loginsInvalidos = JSON.parse(
  readFileSync(new URL('./data/login-invalido.json', import.meta.url), 'utf-8')
);

describe('POST /api/auth/login', () => {
  it('deve retornar um token quando o admin informar e-mail e senha corretos', async () => {
    const token = await loginAdmin();

    expect(token).to.be.a('string').and.not.empty;
  });

  loginsInvalidos.forEach((cenario) => {
    it(`deve retornar ${cenario.esperado.status} para ${cenario.descricao}`, async () => {
      // O e-mail do admin vem do .env; os demais vêm do JSON.
      const email = cenario.perfil === 'admin' ? config.admin.email : cenario.email;

      const resposta = await request(app)
        .post('/api/auth/login')
        .send({ email, senha: cenario.senha });

      expect(resposta.status).to.equal(cenario.esperado.status);
      expect(resposta.body.error).to.equal(cenario.esperado.erro);
    });
  });
});
