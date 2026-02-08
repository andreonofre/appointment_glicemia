/**
 * SCRIPT PARA REMOVER DADOS MOCKADOS
 * 
 * Execute este script no Supabase SQL Editor para remover todos os dados de teste
 */

-- ====================================
-- REMOVER DADOS DE TESTE
-- ====================================

-- Opção 1: Remover APENAS os dados marcados como [TESTE]
DELETE FROM glicemias 
WHERE observacoes LIKE '%[TESTE]%';

-- Verificar quantos foram removidos
SELECT 
    'Dados de teste removidos com sucesso!' as status,
    COUNT(*) as registros_restantes 
FROM glicemias;


-- ====================================
-- OPÇÃO 2: REMOVER TODOS OS DADOS DO USUÁRIO
-- ====================================
-- CUIDADO! Use apenas se quiser limpar TUDO do seu usuário

-- Descomente as linhas abaixo e substitua o UUID se necessário:
/*
DELETE FROM glicemias 
WHERE user_id = 'SEU_USER_ID_AQUI';

SELECT 'Todos os dados do usuário removidos!' as status;
*/
