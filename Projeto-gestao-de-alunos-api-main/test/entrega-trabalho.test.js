// A ordem dos imports importa: config.js carrega o .env antes de o app conectar no banco.
import { readFileSync } from 'node:fs';
import './helpers/config.js';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { loginAdmin, loginAluno } from './helpers/auth.js';

// Data-Driven Testing: os cenários vêm do arquivo JSON.
const cenarios = JSON.parse(
  readFileSync(new URL('./data/entrega-trabalho.json', import.meta.url), 'utf-8')
);

describe('Fluxo: admin cadastra aluno e aluno registra entrega de trabalho', () => {
  cenarios.forEach((cenario, indice) => {
    describe(cenario.descricao, () => {
      // Dados únicos por execução, para não conflitar com e-mail/matrícula já cadastrados.
      const sufixo = `${Date.now()}${indice}`;
      const email = `${cenario.aluno.emailPrefixo}.${sufixo}@example.com`;
      let adminToken;
      let alunoId;
      let alunoToken;

      it('admin faz login', async () => {
        adminToken = await loginAdmin();
        expect(adminToken).to.be.a('string').and.not.empty;
      });

      it('admin cadastra o aluno', async () => {
        const res = await request(app)
          .post('/api/admin/alunos')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            nome: cenario.aluno.nome,
            email,
            matricula: sufixo,
            senha: cenario.aluno.senha,
          });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body.email).to.equal(email);
        expect(res.body).to.not.have.property('senha');
        alunoId = res.body.id;
      });

      if (cenario.matricularNaDisciplina) {
        it('admin matricula o aluno na disciplina', async () => {
          const res = await request(app)
            .post(`/api/admin/disciplinas/${cenario.disciplinaId}/matriculas`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ alunoId });

          expect(res.status).to.equal(201);
          expect(res.body.alunoId).to.equal(alunoId);
          expect(res.body.disciplinaId).to.equal(cenario.disciplinaId);
        });
      }

      it('aluno faz login', async () => {
        alunoToken = await loginAluno(email, cenario.aluno.senha);
        expect(alunoToken).to.be.a('string').and.not.empty;
      });

      it('aluno registra a entrega do trabalho', async () => {
        const res = await request(app)
          .post(`/api/alunos/${alunoId}/trabalhos`)
          .set('Authorization', `Bearer ${alunoToken}`)
          .send({
            disciplinaId: cenario.disciplinaId,
            titulo: cenario.trabalho.titulo,
            descricao: cenario.trabalho.descricao,
          });

        expect(res.status).to.equal(cenario.esperado.status);

        if (cenario.esperado.status === 201) {
          expect(res.body).to.have.property('id');
          expect(res.body.alunoId).to.equal(alunoId);
          expect(res.body.disciplinaId).to.equal(cenario.disciplinaId);
          expect(res.body.titulo).to.equal(cenario.trabalho.titulo);
          expect(res.body.status).to.equal('entregue');
        } else {
          expect(res.body.error).to.equal(cenario.esperado.erro);
        }
      });
    });
  });
});
