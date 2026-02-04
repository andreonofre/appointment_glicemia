# 🔑 GUIA COMPLETO - Configuração de Credenciais

## 📘 PARTE 1: SUPABASE (Banco de Dados)

### Passo 1: Criar Conta no Supabase

1. Acesse: **https://app.supabase.com**
2. Clique em **"Start your project"** ou **"Sign Up"**
3. Escolha uma opção:
   - **GitHub** (recomendado - mais rápido)
   - **Email** (crie conta com seu e-mail)
4. Faça login

---

### Passo 2: Criar Novo Projeto

1. Após login, você verá o dashboard
2. Clique em **"New Project"** (botão verde)
3. Preencha os dados:

   **Nome do Projeto:**
   ```
   glico-diabetes
   ```

   **Database Password:** (crie uma senha forte)
   ```
   Exemplo: MinhaS3nh@Fort3!2026
   ```
   ⚠️ **IMPORTANTE:** Guarde essa senha! Você vai precisar.

   **Region:** (escolha a mais próxima)
   ```
   South America (São Paulo) - se disponível
   OU
   East US (Ohio) - boa alternativa
   ```

4. Clique em **"Create new project"**
5. **Aguarde 2-3 minutos** enquanto o Supabase cria seu banco de dados

---

### Passo 3: Obter as Credenciais do Supabase

Após o projeto ser criado:

1. No menu lateral esquerdo, clique em **⚙️ Settings** (ícone de engrenagem)
2. Clique em **API** (no submenu de Settings)
3. Você verá uma tela com as credenciais

#### 📋 Copie estas 3 informações:

**1. Project URL** (URL do Projeto)
```
Localização: Seção "Project URL"
Aparece como: https://xxxxxxxxxxxxx.supabase.co

Copie para: SUPABASE_URL no arquivo .env
```

**2. anon public** (Chave Pública Anônima)
```
Localização: Seção "Project API keys" > "anon public"
Aparece como: eyJhbGc...[string longa]

Copie para: SUPABASE_ANON_KEY no arquivo .env
```

**3. service_role** (Chave de Serviço)
```
Localização: Seção "Project API keys" > "service_role"
⚠️ CUIDADO: Clique em "Reveal" para mostrar
Aparece como: eyJhbGc...[string longa diferente]

Copie para: SUPABASE_SERVICE_ROLE_KEY no arquivo .env
```

**⚠️ IMPORTANTE:** 
- A chave `service_role` é **SECRETA**! Nunca compartilhe!
- Nunca commite o arquivo `.env` no Git!

---

### Passo 4: Criar as Tabelas no Banco de Dados

1. No menu lateral esquerdo, clique em **🗄️ SQL Editor**
2. Clique em **"New query"** (ou "+ New query")
3. Abra o arquivo `backend/database-schema.sql` do seu projeto
4. **Copie TODO o conteúdo** do arquivo
5. **Cole** no SQL Editor do Supabase
6. Clique em **"Run"** (botão verde no canto inferior direito)
7. Você verá uma mensagem: ✅ **"Success. No rows returned"**

**Pronto!** Suas tabelas foram criadas:
- ✅ `profiles` - Perfis de usuários
- ✅ `glicemias` - Registros de glicemia

Para verificar:
- Clique em **📊 Table Editor** no menu lateral
- Você deve ver as tabelas `profiles` e `glicemias`

---

## 📧 PARTE 2: RESEND (Envio de E-mails)

### Passo 1: Criar Conta no Resend

1. Acesse: **https://resend.com**
2. Clique em **"Sign Up"** ou **"Get Started"**
3. Preencha:
   - **Email:** seu e-mail
   - **Password:** crie uma senha
4. Clique em **"Create account"**
5. **Confirme seu e-mail** (verifique sua caixa de entrada)

---

### Passo 2: Obter API Key do Resend

1. Após login, você estará no dashboard
2. No menu lateral esquerdo, clique em **🔑 API Keys**
3. Clique em **"Create API Key"** (botão azul)
4. Preencha:

   **Name:**
   ```
   Glico Production
   ```

   **Permission:**
   ```
   ✅ Sending access (deixe marcado)
   ```

5. Clique em **"Add"** ou **"Create"**
6. **⚠️ ATENÇÃO:** Uma janela aparecerá com sua API Key

   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

7. **COPIE IMEDIATAMENTE!** 
   - Esta chave só aparece UMA VEZ
   - Se fechar sem copiar, terá que criar outra

   **Copie para:** `RESEND_API_KEY` no arquivo .env

---

### Passo 3: Configurar Domínio de E-mail (Opcional)

#### Opção A: Usar Domínio de Teste (Mais Rápido)

O Resend fornece um domínio de teste automaticamente:

```
FROM_EMAIL=onboarding@resend.dev
```

✅ **Vantagens:**
- Funciona imediatamente
- Não precisa configurar DNS

❌ **Limitações:**
- Só envia para o seu próprio e-mail
- Aparece como "via resend.dev"

#### Opção B: Usar Seu Próprio Domínio (Recomendado para Produção)

1. No Resend, clique em **🌐 Domains**
2. Clique em **"Add Domain"**
3. Digite seu domínio (ex: `seudominio.com`)
4. Siga as instruções para adicionar registros DNS
5. Aguarde verificação (alguns minutos)
6. Depois de verificado, use:

```
FROM_EMAIL=noreply@seudominio.com
```

**💡 Dica para desenvolvimento:** Use a Opção A (domínio de teste) por enquanto!

---

## ⚙️ PARTE 3: CONFIGURAR ARQUIVO .ENV DO BACKEND

### Passo 1: Criar o Arquivo .env

1. Vá para a pasta `backend`
2. **Copie** o arquivo `.env.example`
3. **Cole** na mesma pasta
4. **Renomeie** para `.env` (sem o ".example")

**No PowerShell/Terminal:**
```powershell
cd backend
copy .env.example .env
```

---

### Passo 2: Preencher as Credenciais

Abra o arquivo `backend/.env` e preencha:

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Supabase
# Cole aqui as credenciais que você copiou do Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...

# Configurações do Resend para envio de e-mails
# Cole aqui a API key que você copiou do Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email remetente (use onboarding@resend.dev para testes)
FROM_EMAIL=onboarding@resend.dev

# JWT Secret para autenticação (crie uma senha aleatória forte)
JWT_SECRET=minha-chave-super-secreta-aleatoria-2026

# CORS - URLs permitidas (frontend)
CORS_ORIGIN=http://localhost:5173

# Configurações de Lembretes
REMINDER_CRON_SCHEDULE=0 8,12,18,22 * * *
```

---

### ✅ Exemplo Completo Preenchido:

```env
PORT=3000
NODE_ENV=development

# Supabase (SUBSTITUA pelos seus valores reais)
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY...

# Resend (SUBSTITUA pela sua API key real)
RESEND_API_KEY=re_123456789abcdefghijklmnopqrstuvwxyz

FROM_EMAIL=onboarding@resend.dev
JWT_SECRET=glico-diabetes-2026-super-secret-key-12345
CORS_ORIGIN=http://localhost:5173
REMINDER_CRON_SCHEDULE=0 8,12,18,22 * * *
```

---

## 🧪 PARTE 4: TESTAR AS CREDENCIAIS

### Teste 1: Iniciar o Backend

```powershell
cd backend
npm run dev
```

**✅ Se aparecer:**
```
🩺  Servidor Glico iniciado com sucesso!
🩺  Porta: 3000
```

**Suas credenciais do Supabase estão corretas!**

**❌ Se aparecer erro:**
```
Error: Faltam as credenciais do Supabase
```
- Verifique se o arquivo `.env` existe
- Verifique se as variáveis estão preenchidas corretamente

---

### Teste 2: Testar o Frontend

```powershell
cd frontend
npm run dev
```

Acesse: **http://localhost:5173**

1. Clique em **"Cadastre-se"**
2. Preencha os dados
3. Clique em **"Cadastrar"**

**✅ Se o cadastro funcionar:**
- Suas credenciais estão 100% corretas!
- Você pode fazer login e usar o sistema

**❌ Se aparecer erro:**
- Abra o Console do navegador (F12)
- Veja a mensagem de erro
- Verifique se o backend está rodando

---

## 📋 CHECKLIST FINAL

Marque conforme for completando:

### Supabase
- [ ] Conta criada
- [ ] Projeto criado
- [ ] `SUPABASE_URL` copiada
- [ ] `SUPABASE_ANON_KEY` copiada  
- [ ] `SUPABASE_SERVICE_ROLE_KEY` copiada
- [ ] Arquivo `database-schema.sql` executado no SQL Editor
- [ ] Tabelas `profiles` e `glicemias` criadas

### Resend
- [ ] Conta criada
- [ ] Email confirmado
- [ ] API Key criada
- [ ] `RESEND_API_KEY` copiada
- [ ] `FROM_EMAIL` definido

### Configuração
- [ ] Arquivo `backend/.env` criado
- [ ] Todas as variáveis preenchidas
- [ ] Backend iniciado com sucesso
- [ ] Frontend iniciado com sucesso
- [ ] Cadastro de usuário funcionando

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Invalid API credentials" no Supabase

**Solução:**
1. Verifique se copiou as credenciais corretamente
2. Certifique-se que não tem espaços extras
3. Verifique se é do projeto correto
4. Tente gerar novas credenciais (Settings > API > Reset)

### ❌ "Authentication failed" no Resend

**Solução:**
1. Verifique se a API Key está correta
2. Crie uma nova API Key
3. Certifique-se que tem "Sending access"

### ❌ E-mails não são enviados

**Solução:**
1. Verifique se está usando `onboarding@resend.dev` para testes
2. Verifique os logs do backend
3. No Resend, vá em "Emails" para ver tentativas de envio
4. Verifique spam/lixo eletrônico

### ❌ "CORS Error" no frontend

**Solução:**
1. Verifique se `CORS_ORIGIN=http://localhost:5173` no .env
2. Reinicie o backend após alterar .env
3. Limpe o cache do navegador (Ctrl+Shift+Del)

---

## 📞 Links Úteis

- **Supabase Dashboard:** https://app.supabase.com
- **Supabase Docs:** https://supabase.com/docs
- **Resend Dashboard:** https://resend.com/emails
- **Resend Docs:** https://resend.com/docs

---

## 🎉 Parabéns!

Se você marcou todos os itens do checklist, está tudo pronto!

**Próximo passo:** Rodar o sistema completo!

```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2  
cd frontend
npm run dev
```

Acesse: **http://localhost:5173** e comece a usar o Glico! 🩺

---

**💡 Dica Final:** Guarde suas credenciais em um local seguro (gerenciador de senhas)!
