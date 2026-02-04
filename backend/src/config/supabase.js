/**
 * CONFIGURAÇÃO DO SUPABASE
 * 
 * Este arquivo configura a conexão com o Supabase, que é nosso banco de dados.
 * 
 * O que é o Supabase?
 * - É uma plataforma que fornece banco de dados PostgreSQL
 * - Oferece autenticação de usuários
 * - Armazena dados de forma segura
 * 
 * Como fazer manutenção:
 * 1. As credenciais ficam no arquivo .env (nunca commitar esse arquivo!)
 * 2. Para trocar de projeto Supabase, basta alterar as variáveis no .env
 * 3. createClient cria a conexão - não precisa mexer aqui
 */

const { createClient } = require('@supabase/supabase-js');

// Lê as configurações do arquivo .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verifica se as credenciais existem
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltam as credenciais do Supabase no arquivo .env');
}

// Cliente para operações normais (usado pela maioria das funções)
const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente administrativo (usado para operações que precisam de mais permissões)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
  supabase,
  supabaseAdmin
};
