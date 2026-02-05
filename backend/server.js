/**
 * SERVIDOR PRINCIPAL DO BACKEND
 * 
 * Este é o arquivo principal que inicia o servidor Node.js.
 * 
 * O que faz:
 * - Configura o Express (framework web)
 * - Define middlewares (CORS, JSON, etc)
 * - Registra as rotas
 * - Inicia o servidor na porta 3000
 * 
 * Como fazer manutenção:
 * - Para adicionar novas rotas, importe e registre aqui
 * - Para modificar porta, altere o .env
 * - Para adicionar middlewares, adicione antes das rotas
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importa as rotas
const authRoutes = require('./src/routes/authRoutes');
const glicemiaRoutes = require('./src/routes/glicemiaRoutes');

// Cria a aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES
// ==========================================

// Helmet - Segurança (adiciona headers HTTP seguros)
app.use(helmet());

// CORS - Permite requisições do frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Morgan - Logs de requisições (útil para debug)
app.use(morgan('dev'));

// Log personalizado para todas as requisições
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Express JSON - Permite receber JSON no body
app.use(express.json());

// Express URL Encoded - Permite receber dados de formulários
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROTAS
// ==========================================

// Rota de teste (para verificar se o servidor está funcionando)
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Glico - Servidor funcionando! 🩺',
    version: '1.0.0',
    status: 'online'
  });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de glicemias
app.use('/api/glicemias', glicemiaRoutes);

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada.',
    path: req.path 
  });
});

// Erro geral do servidor
app.use((error, req, res, next) => {
  console.error('❌ Erro no servidor:', error);
  console.error('Stack:', error.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor.',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log('');
  console.log('🩺 =======================================');
  console.log('🩺  Servidor Glico iniciado com sucesso!');
  console.log('🩺 =======================================');
  console.log(`🩺  Porta: ${PORT}`);
  console.log(`🩺  URL: http://localhost:${PORT}`);
  console.log(`🩺  Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🩺  CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log('🩺 =======================================');
  console.log('');
  console.log('📊 Variáveis de ambiente carregadas:');
  console.log(`✅ SUPABASE_URL: ${process.env.SUPABASE_URL ? 'Definida' : '❌ Não definida'}`);
  console.log(`✅ SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? 'Definida' : '❌ Não definida'}`);
  console.log(`✅ RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'Definida' : '❌ Não definida'}`);
  console.log(`✅ JWT_SECRET: ${process.env.JWT_SECRET ? 'Definida' : '❌ Não definida'}`);
  console.log('');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
  process.exit(1);
});

module.exports = app;
