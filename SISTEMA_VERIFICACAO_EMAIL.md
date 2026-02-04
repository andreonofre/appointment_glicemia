# 📧 Sistema de Verificação de Email

Este documento explica como funciona o sistema de verificação por email com código de 6 dígitos no Glico.

---

## 🔄 Fluxo do Sistema

### 1. **Cadastro Inicial (Register.jsx)**

O usuário preenche o formulário de cadastro:
- Nome completo
- Email
- Senha
- Idade (opcional)
- Tipo de diabetes (opcional)

Ao clicar em **"Cadastrar"**:
- Os dados são enviados para `/api/auth/register`
- Backend **NÃO cria o usuário ainda**
- Backend gera código de 6 dígitos
- Código é salvo na tabela `verification_codes`
- Email é enviado via Resend com o código
- Frontend redireciona para `/verify-code`

---

### 2. **Verificação de Código (VerifyCode.jsx)**

O usuário recebe email com código de 6 dígitos.

Na tela de verificação:
- 6 campos para digitar cada dígito
- Suporta cola (copiar/colar código completo)
- Validação automática
- Botão para reenviar código

Ao submeter o código:
- Frontend envia para `/api/auth/verify-code`
- Backend verifica se código é válido
- Backend verifica se código não expirou (15 minutos)
- Se válido: cria usuário no Supabase Auth
- Se válido: cria perfil na tabela `profiles`
- Marca código como verificado
- Redireciona para `/login` com mensagem de sucesso

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `verification_codes`

```sql
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  code VARCHAR(6) NOT NULL,
  user_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `email`: Email do usuário
- `code`: Código de 6 dígitos (ex: "123456")
- `user_data`: JSON com dados do cadastro (nome, senha, idade, tipo diabetes)
- `expires_at`: Data/hora de expiração (15 minutos após criação)
- `verified`: Flag se o código já foi usado

**⚠️ IMPORTANTE:** Execute o script SQL para criar a tabela:

```bash
# No Supabase Dashboard:
# 1. Vá em SQL Editor
# 2. Abra o arquivo backend/database-verification-codes.sql
# 3. Execute o script
```

---

## 🔐 Segurança

### Expiração de Código
- Cada código expira em **15 minutos**
- Após expiração, usuário deve solicitar novo código
- Backend verifica `expires_at` antes de validar

### Unicidade de Email
- Coluna `email` tem constraint UNIQUE
- Ao registrar com email existente, **substitui** código anterior (upsert)
- Evita múltiplos códigos para mesmo email

### Hash de Senha
- Senha é armazenada temporariamente em `user_data`
- Após verificação, Supabase Auth faz hash da senha
- `user_data` pode ser deletado após uso

---

## 📧 Template de Email

O email é enviado via **Resend** com template HTML profissional:

```javascript
// backend/src/services/emailService.js
async function sendVerificationCode(email, nome, code) {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Código de Verificação - Glico',
    html: `...` // Template HTML com design Glico
  });
}
```

**Design do Email:**
- Header com gradiente teal/green
- Logo do Glico
- Código em destaque (48px, branco, fundo gradiente)
- Aviso de expiração em 15 minutos
- Footer com informações

---

## 🔧 Endpoints da API

### POST `/api/auth/register`

**Corpo da requisição:**
```json
{
  "nome": "Maria Silva",
  "email": "maria@exemplo.com",
  "password": "senha123",
  "idade": 35,
  "tipoDiabetes": "Tipo 2"
}
```

**Resposta de sucesso (200):**
```json
{
  "message": "Código de verificação enviado para seu email!",
  "email": "maria@exemplo.com"
}
```

**Resposta de erro (400):**
```json
{
  "error": "Email, senha e nome são obrigatórios."
}
```

---

### POST `/api/auth/verify-code`

**Corpo da requisição:**
```json
{
  "email": "maria@exemplo.com",
  "code": "123456"
}
```

**Resposta de sucesso (201):**
```json
{
  "message": "Email verificado! Usuário cadastrado com sucesso!",
  "user": {
    "id": "uuid-do-usuario",
    "email": "maria@exemplo.com",
    ...
  }
}
```

**Resposta de erro (400):**
```json
{
  "error": "Código inválido ou expirado."
}
```

ou

```json
{
  "error": "Código expirado. Solicite um novo."
}
```

---

## 🧪 Testando o Sistema

### 1. Criar tabela no Supabase

```bash
# No Supabase Dashboard > SQL Editor
# Execute: backend/database-verification-codes.sql
```

### 2. Configurar Resend

Certifique-se que o `.env` do backend tem:
```env
RESEND_API_KEY=re_PYRG51bD_QKb16hTV117RKPn7jkHPe1z4
```

### 3. Iniciar Backend e Frontend

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Testar Fluxo Completo

1. Acesse http://localhost:5173/cadastro
2. Preencha o formulário
3. Clique em "Cadastrar"
4. Verifique seu email
5. Copie o código de 6 dígitos
6. Cole ou digite na tela de verificação
7. Clique em "Verificar Código"
8. Deve redirecionar para `/login` com sucesso

---

## 🐛 Debug e Logs

### Backend

Os logs aparecem no terminal do backend:

```
✅ Email de verificação enviado para maria@exemplo.com
```

Se der erro:
```
❌ Erro ao enviar email de verificação: [detalhes]
```

### Verificar no Banco

```sql
-- Ver códigos gerados
SELECT email, code, expires_at, verified 
FROM verification_codes 
ORDER BY created_at DESC;

-- Ver usuários criados
SELECT email, created_at 
FROM auth.users 
ORDER BY created_at DESC;
```

---

## 🔍 Troubleshooting

### Email não chega

**Possíveis causas:**
1. Resend API Key inválida
2. Email está em spam/lixo eletrônico
3. Email do remetente (`onboarding@resend.dev`) bloqueado

**Solução:**
- Verifique API Key no `.env`
- Confira pasta de spam
- Teste com outro email

### Código inválido sempre

**Possíveis causas:**
1. Código expirou (15 minutos)
2. Email digitado diferente
3. Código já foi usado (`verified = true`)

**Solução:**
- Solicite novo código
- Verifique se email está correto
- Limpe registros antigos da tabela

### Usuário não é criado

**Possíveis causas:**
1. Supabase Auth desabilitado
2. Senha muito fraca
3. Email já cadastrado

**Solução:**
- Habilite Auth no Supabase Dashboard
- Use senha com 6+ caracteres
- Tente com outro email

---

## 📊 Métricas e Monitoramento

### Códigos Pendentes

```sql
SELECT COUNT(*) 
FROM verification_codes 
WHERE verified = false 
  AND expires_at > NOW();
```

### Taxa de Conversão

```sql
SELECT 
  COUNT(CASE WHEN verified = true THEN 1 END) as verificados,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(CASE WHEN verified = true THEN 1 END) / COUNT(*), 2) as taxa_conversao
FROM verification_codes;
```

---

## 🚀 Melhorias Futuras

- [ ] Limitar número de tentativas de código
- [ ] Rate limiting no envio de emails
- [ ] Limpeza automática de códigos expirados
- [ ] Estatísticas de conversão
- [ ] A/B test de templates de email
- [ ] Suporte a SMS (Twilio)
- [ ] Verificação em duas etapas (2FA)

---

## ✅ Checklist de Implementação

- [x] Tabela `verification_codes` criada
- [x] Endpoint `/api/auth/register` modificado
- [x] Endpoint `/api/auth/verify-code` criado
- [x] Função `sendVerificationCode()` criada
- [x] Página `VerifyCode.jsx` criada
- [x] Rota `/verify-code` adicionada ao App.jsx
- [x] Register.jsx redireciona para VerifyCode
- [x] Email template criado
- [x] Validação de expiração implementada
- [x] Tratamento de erros implementado

---

**Sistema pronto para uso! 🎉**
