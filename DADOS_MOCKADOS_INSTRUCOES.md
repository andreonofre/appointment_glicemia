# 📊 Como Usar os Dados Mockados de Teste

## 🎯 Objetivo
Criar dados realistas de glicemia para testar o sistema sem precisar inserir manualmente.

---

## 📝 Passo a Passo

### 1️⃣ **Pegar o UUID do Seu Usuário**

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Execute este comando:

```sql
SELECT id, email FROM auth.users WHERE email = 'seu-email@gmail.com';
```

4. **Copie o UUID** retornado (algo como: `123e4567-e89b-12d3-a456-426614174000`)

---

### 2️⃣ **Inserir Dados de Teste**

1. Abra o arquivo: `backend/dados-mockados-teste.sql`
2. **Substitua** `'SEU_USER_ID_AQUI'` pelo UUID que você copiou
3. Copie **TODO** o conteúdo do arquivo
4. Vá no **Supabase SQL Editor**
5. Cole e clique em **RUN**

✅ **Resultado esperado:**
- Mensagem: `Dados mockados inseridos com sucesso!`
- Total de aproximadamente **180-200 registros** criados
- Dados dos últimos **30 dias**

---

### 3️⃣ **Verificar os Dados no Sistema**

1. Faça login na aplicação
2. Vá em **Histórico**
3. Você verá o heatmap preenchido com dados coloridos
4. Teste diferentes períodos (7, 14, 30 dias)

---

### 4️⃣ **Remover Dados de Teste**

Quando quiser limpar os dados mockados:

1. Abra o arquivo: `backend/remover-dados-mockados.sql`
2. Copie o conteúdo
3. Execute no **Supabase SQL Editor**

✅ Isso remove **APENAS** os registros marcados com `[TESTE]` nas observações

---

## 📊 O Que os Dados Contêm

### Momentos do Dia:
- ☕ **Jejum** (7h00-7h30) - 85% preenchido
- ⏱️ **2h após café** (9h00-10h00) - 80% preenchido
- 🍽️ **Antes almoço** (11h30-12h30) - 75% preenchido
- ⏱️ **2h após almoço** (14h00-15h00) - 80% preenchido
- 🍴 **Antes jantar** (18h30-19h30) - 70% preenchido
- ⏱️ **2h após jantar** (20h30-21h30) - 75% preenchido
- 🌙 **Ao deitar** (22h00-23h00) - 65% preenchido
- 🌃 **Madrugada** (3h00-4h00) - 30% preenchido

### Valores Gerados:
- **Jejum:** 70-170 mg/dL
- **Pós-prandial:** 90-230 mg/dL
- **Antes refeições:** 80-180 mg/dL
- **Ao deitar:** 90-210 mg/dL
- **Madrugada:** 70-160 mg/dL

### Características:
- Valores **realistas** com variação natural
- Alguns registros têm **medicamentos** (Insulina NPH/Regular)
- Todos marcados com `[TESTE]` nas observações
- Distribuição natural ao longo do dia

---

## 🔍 Comandos Úteis

### Ver quantos registros você tem:
```sql
SELECT COUNT(*) FROM glicemias WHERE observacoes LIKE '%[TESTE]%';
```

### Ver resumo por data:
```sql
SELECT 
    DATE(data_hora) as data,
    COUNT(*) as total,
    ROUND(AVG(valor)) as media
FROM glicemias 
WHERE observacoes LIKE '%[TESTE]%'
GROUP BY DATE(data_hora)
ORDER BY data DESC;
```

### Ver todos os seus dados (teste + reais):
```sql
SELECT * FROM glicemias 
WHERE user_id = 'SEU_USER_ID_AQUI'
ORDER BY data_hora DESC
LIMIT 50;
```

---

## ⚠️ Avisos Importantes

1. **Sempre substitua** `'SEU_USER_ID_AQUI'` pelo seu UUID real
2. Os dados mockados são marcados com `[TESTE]` para fácil identificação
3. Você pode executar o script várias vezes (ele remove os antigos antes)
4. Para remover, use o script `remover-dados-mockados.sql`

---

## 🆘 Problemas Comuns

### "Nenhum dado aparece no heatmap"
- Verifique se substituiu o UUID corretamente
- Confirme que está logado com o mesmo usuário
- Execute a query de verificação acima

### "Erro ao executar SQL"
- Verifique se o UUID está entre aspas simples: `'uuid-aqui'`
- Certifique-se de copiar o script completo
- Verifique se a tabela `glicemias` existe

### "Quero mais dados"
- Edite a linha `FOR i IN 0..29 LOOP` 
- Troque `29` por `59` para 60 dias de dados
- Troque `29` por `89` para 90 dias de dados

---

## 📌 Exemplo Prático

```sql
-- 1. Pegar UUID
SELECT id, email FROM auth.users WHERE email = 'yeis.mota@gmail.com';
-- Retorna: 123e4567-e89b-12d3-a456-426614174000

-- 2. No arquivo dados-mockados-teste.sql, substituir:
v_user_id UUID := '123e4567-e89b-12d3-a456-426614174000';

-- 3. Executar o script completo

-- 4. Verificar
SELECT COUNT(*) FROM glicemias WHERE observacoes LIKE '%[TESTE]%';
-- Retorna: ~180 registros
```

---

✅ **Pronto! Agora você tem dados realistas para testar o sistema!**
