/**
 * ATUALIZAÇÃO DO SCHEMA DO BANCO DE DADOS
 * 
 * Execute este SQL no painel do Supabase para adicionar os novos campos.
 * 
 * Como usar:
 * 1. Acesse seu projeto no Supabase: https://app.supabase.com
 * 2. Vá em "SQL Editor"
 * 3. Cole este código e execute
 * 
 * Alterações:
 * - Novos campos na tabela profiles
 * - Atualização das categorias de glicemia
 */

-- ==========================================
-- ADICIONAR NOVOS CAMPOS NA TABELA PROFILES
-- ==========================================

-- Adicionar campo data_nascimento
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS data_nascimento DATE;

-- Adicionar campo endereco
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS endereco TEXT;

-- Adicionar campo contato
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS contato VARCHAR(20);

-- Adicionar campo medicamentos_uso
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS medicamentos_uso TEXT;

-- Renomear e adicionar campos de metas glicêmicas
-- Jejum mínimo
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS meta_jejum_min INTEGER DEFAULT 70;

-- Jejum máximo
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS meta_jejum_max INTEGER DEFAULT 100;

-- Pós-prandial máximo
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS meta_pos_prandial_max INTEGER DEFAULT 140;

-- Glicemia mínima aceitável
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS meta_glicemia_min INTEGER DEFAULT 70;

-- Glicemia máxima aceitável  
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS meta_glicemia_max INTEGER DEFAULT 180;

-- Aceite de termos
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS aceite_termos BOOLEAN DEFAULT false;

-- Aceite de política de privacidade
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS aceite_privacidade BOOLEAN DEFAULT false;

-- ==========================================
-- COMENTÁRIOS DAS COLUNAS PARA DOCUMENTAÇÃO
-- ==========================================

COMMENT ON COLUMN profiles.data_nascimento IS 'Data de nascimento do usuário';
COMMENT ON COLUMN profiles.endereco IS 'Endereço completo do usuário';
COMMENT ON COLUMN profiles.contato IS 'Telefone de contato do usuário';
COMMENT ON COLUMN profiles.medicamentos_uso IS 'Lista de medicamentos em uso pelo usuário';
COMMENT ON COLUMN profiles.meta_jejum_min IS 'Meta glicêmica mínima em jejum (mg/dL)';
COMMENT ON COLUMN profiles.meta_jejum_max IS 'Meta glicêmica máxima em jejum (mg/dL)';
COMMENT ON COLUMN profiles.meta_pos_prandial_max IS 'Meta glicêmica máxima pós-prandial (mg/dL)';
COMMENT ON COLUMN profiles.meta_glicemia_min IS 'Glicemia mínima aceitável (mg/dL)';
COMMENT ON COLUMN profiles.meta_glicemia_max IS 'Glicemia máxima aceitável (mg/dL)';
COMMENT ON COLUMN profiles.aceite_termos IS 'Usuário aceitou os termos de uso';
COMMENT ON COLUMN profiles.aceite_privacidade IS 'Usuário aceitou a política de privacidade LGPD';

-- ==========================================
-- ATUALIZAR CATEGORIAS PERMITIDAS
-- ==========================================

-- Note: Este é apenas um comentário para documentação
-- As categorias de glicemia agora incluem:
-- - jejum
-- - antes-refeicoes (anteriormente pre-refeicao)
-- - pos-prandial-1h (novo)
-- - pos-prandial-2h (anteriormente pos-prandial)
-- - antes-dormir
-- - madrugada (novo)
-- - outros (novo)

-- Se desejar adicionar constraint para validar categorias:
/*
ALTER TABLE glicemias 
ADD CONSTRAINT check_categoria 
CHECK (categoria IN (
  'jejum', 
  'antes-refeicoes', 
  'pos-prandial-1h', 
  'pos-prandial-2h', 
  'antes-dormir', 
  'madrugada', 
  'outros'
));
*/

-- ==========================================
-- MENSAGEM DE SUCESSO
-- ==========================================
DO $$
BEGIN
  RAISE NOTICE '✅ Schema atualizado com sucesso!';
  RAISE NOTICE '📝 Novos campos adicionados à tabela profiles';
  RAISE NOTICE '🎯 Metas glicêmicas personalizadas configuradas';
END $$;
