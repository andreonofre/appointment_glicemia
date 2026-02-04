/**
 * MIDDLEWARE DE AUTENTICAÇÃO
 * 
 * Este arquivo verifica se o usuário está logado antes de acessar rotas protegidas.
 * 
 * O que é um middleware?
 * - É uma função que executa ANTES da rota principal
 * - Verifica permissões, autenticação, etc.
 * 
 * Como funciona:
 * 1. Recebe o token do header da requisição
 * 2. Verifica se o token é válido no Supabase
 * 3. Se válido, permite acesso. Se não, retorna erro 401
 * 
 * Como fazer manutenção:
 * - Para adicionar mais verificações, adicione antes do next()
 * - Para mudar mensagens de erro, altere os textos dos responses
 */

const { supabase } = require('../config/supabase');

async function authenticateToken(req, res, next) {
  try {
    // Pega o token do header Authorization
    // Formato esperado: "Bearer seu-token-aqui"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Se não tem token, retorna erro
    if (!token) {
      return res.status(401).json({ 
        error: 'Acesso negado. Token não fornecido.' 
      });
    }

    // Verifica o token no Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ 
        error: 'Token inválido ou expirado.' 
      });
    }

    // Adiciona o usuário na requisição para usar nas rotas
    req.user = user;
    
    // Continua para a próxima função (rota)
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ 
      error: 'Erro ao verificar autenticação.' 
    });
  }
}

module.exports = { authenticateToken };
