# 🚀 INSTRUÇÕES DE CONFIGURAÇÃO DO BANCO DE DADOS

## Execute no SQL Editor do Supabase

Para adicionar o suporte a medicamentos na tabela de glicemias, execute o seguinte SQL no SQL Editor do Supabase:

### 1. Adicionar campo medicamentos

```sql
-- Adicionar campo medicamentos na tabela glicemias
ALTER TABLE glicemias 
ADD COLUMN IF NOT EXISTS medicamentos TEXT;

-- Comentário descritivo
COMMENT ON COLUMN glicemias.medicamentos IS 'Medicamentos ou insulina aplicados antes da medição';
```

## Como executar:

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá em "SQL Editor" no menu lateral
3. Clique em "New Query"
4. Cole o SQL acima
5. Clique em "Run" ou pressione Ctrl+Enter

## ✅ Verificação

Para verificar se foi criado corretamente:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'glicemias' 
AND column_name = 'medicamentos';
```

Deve retornar:
```
column_name  | data_type
-------------|----------
medicamentos | text
```

## 📝 Observações

- O campo é opcional (pode ser NULL)
- Armazena texto livre para descrever medicamentos/insulina
- Exemplos de valores: "Insulina NPH 10u", "Metformina 850mg", etc.
