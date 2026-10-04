// IMPORTANTE: este arquivo precisa ser importado ANTES de '../src/app.js'.
// O app conecta no MongoDB ao ser carregado e lê MONGODB_URI nesse momento.
import 'dotenv/config';

const { ADMIN_EMAIL, ADMIN_SENHA } = process.env;

if (!ADMIN_EMAIL || !ADMIN_SENHA) {
  throw new Error(
    'Defina ADMIN_EMAIL e ADMIN_SENHA no arquivo .env (use .env.example como modelo).'
  );
}

export const config = {
  admin: { email: ADMIN_EMAIL, senha: ADMIN_SENHA },
};
