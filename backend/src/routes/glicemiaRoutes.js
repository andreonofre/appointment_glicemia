/**
 * ROTAS DE GLICEMIAS
 * 
 * Define as URLs para gerenciar registros de glicemia.
 * Todas as rotas são protegidas (precisa estar logado).
 * 
 * Rotas disponíveis:
 * - POST /glicemias - Criar registro
 * - GET /glicemias - Listar registros
 * - GET /glicemias/stats - Estatísticas
 * - GET /glicemias/:id - Buscar registro específico
 * - PUT /glicemias/:id - Atualizar registro
 * - DELETE /glicemias/:id - Deletar registro
 */

const express = require('express');
const router = express.Router();
const glicemiaController = require('../controllers/glicemiaController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas de glicemia são protegidas
router.use(authenticateToken);

// Rotas
router.post('/', glicemiaController.create);
router.get('/', glicemiaController.list);
router.get('/stats', glicemiaController.getStats);
router.get('/:id', glicemiaController.getById);
router.put('/:id', glicemiaController.update);
router.delete('/:id', glicemiaController.deleteRecord);

module.exports = router;
