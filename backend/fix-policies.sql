/**
 * CORREÇÃO DAS POLÍTICAS RLS - GLICEMIAS
 * 
 * Execute este script no Supabase SQL Editor para corrigir o erro de FK
 * 
 * O erro ocorre porque falta a policy de INSERT para a tabela glicemias.
 * Este script remove todas as policies existentes e as recria corretamente.
 */

-- Remove TODAS as policies da tabela glicemias (mesmo que tenham nomes diferentes)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'glicemias') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON glicemias';
    END LOOP;
END $$;

-- Recria as policies corretas
CREATE POLICY "Usuários podem ver suas próprias glicemias"
  ON glicemias FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias glicemias"
  ON glicemias FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias glicemias"
  ON glicemias FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias glicemias"
  ON glicemias FOR DELETE
  USING (auth.uid() = user_id);

-- Verifica se RLS está habilitado
ALTER TABLE glicemias ENABLE ROW LEVEL SECURITY;

-- Confirma as policies criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'glicemias'
ORDER BY policyname;
