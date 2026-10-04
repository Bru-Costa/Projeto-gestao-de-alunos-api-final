// Carregado antes de qualquer teste: garante que o .env seja lido antes de o app conectar no banco.
import './config.js';
import mongoose from 'mongoose';

// Hook global: fecha a conexão com o MongoDB uma única vez, depois de TODOS os testes.
// (Fechar dentro de um arquivo de teste específico quebraria os arquivos seguintes.)
after(async () => {
  await mongoose.connection.close();
});
