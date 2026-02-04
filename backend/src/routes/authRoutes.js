/**
 * ROTAS DE AUTENTICAÇÃO
 * 
 * Define as URLs para cadastro, login e logout.
 * 
 * Rotas disponíveis:
 * - POST /auth/register - Cadastro
 * - POST /auth/login - Login
 * - POST /auth/logout - Logout
 * - GET /auth/me - Dados do usuário (protegida)
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Rotas públicas
router.post('/register', authController.register);
router.post('/verify-code', authController.verifyCode);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);

// Rotas protegidas (precisa estar logado)
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
