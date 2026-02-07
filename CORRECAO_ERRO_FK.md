# Correção do Erro de Foreign Key ao Salvar Glicemia

## 🔴 Erro Identificado

```
insert or update on table "glicemias" 
violates foreign key constraint 
"glicemias_user_id_fkey"
```

## 📋 Causa Real

A foreign key `glicemias_user_id_fkey` está apontando para a **tabela errada**.
- ❌ **Errado**: `profiles(id)` - usuário pode não ter perfil criado ainda
- ✅ **Correto**: `auth.users(id)` - sempre existe quando o usuário loga

## ✅ Solução Completa

### Execute os 2 scripts na ordem:

#### 1️⃣ Primeiro: Corrigir a Foreign Key

1. Acesse: https://app.supabase.com → seu projeto → **SQL Editor**
2. Cole e execute: `backend/fix-foreign-key.sql`

Este script vai:
- ❌ Remover a FK antiga (que aponta para lugar errado)
- ✅ Criar FK nova apontando para `auth.users(id)`
- 🔍 Confirmar que foi criada corretamente

#### 2️⃣ Depois: Corrigir as Policies

1. No mesmo SQL Editor
2. Cole e execute: `backend/fix-policies.sql`

Este script vai:
- ❌ Remover todas as policies antigas
- ✅ Criar as 4 policies necessárias (SELECT, INSERT, UPDATE, DELETE)
- 🔍 Listar as policies criadas

### 🧪 Testar o Sistema

1. Faça **logout** do sistema
2. Faça **login** novamente
3. Tente registrar uma glicemia
4. ✅ Deve funcionar perfeitamente!

## 🔍 Verificação (se necessário)

Execute esta query para ver a FK atual:

```sql
SELECT
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'glicemias'
  AND kcu.column_name = 'user_id';
```

**Resultado esperado**:
- `foreign_table_name` = `users` (não `profiles`)
- `foreign_column_name` = `id`

## 📞 Ainda com Erro?

Se o erro persistir:

1. **Limpe o cache**: Ctrl+Shift+Delete
2. **Logout/Login**: Saia e entre novamente
3. **Verifique o console**: F12 → Console (veja se há outros erros)
4. **Verifique se está logado**: `supabase.auth.getUser()` deve retornar usuário
