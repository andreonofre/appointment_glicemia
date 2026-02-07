/**
 * CORREÇÃO DA FOREIGN KEY - GLICEMIAS
 * 
 * O erro persiste porque a foreign key está incorreta.
 * Este script corrige a constraint apontando para auth.users
 */

-- Passo 1: Remove a constraint antiga
ALTER TABLE glicemias 
DROP CONSTRAINT IF EXISTS glicemias_user_id_fkey;

-- Passo 2: Recria a constraint correta apontando para auth.users
ALTER TABLE glicemias
ADD CONSTRAINT glicemias_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Passo 3: Verifica a constraint criada
SELECT
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'glicemias'
  AND kcu.column_name = 'user_id';
