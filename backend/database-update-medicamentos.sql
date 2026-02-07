/**
 * ATUALIZAÇÃO DO SCHEMA - ADICIONAR CAMPO MEDICAMENTOS
 * 
 * Execute este SQL no SQL Editor do Supabase para adicionar
 * o campo de medicamentos na tabela glicemias.
 */

-- Adicionar campo medicamentos na tabela glicemias
ALTER TABLE glicemias 
ADD COLUMN IF NOT EXISTS medicamentos TEXT;

-- Comentário descritivo
COMMENT ON COLUMN glicemias.medicamentos IS 'Medicamentos ou insulina aplicados antes da medição';
