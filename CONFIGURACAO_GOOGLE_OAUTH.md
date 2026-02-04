# 🔐 Configuração do Login com Google

Este documento explica como configurar o login do Google OAuth no Supabase para o Glico.

## 📋 Pré-requisitos

- Conta no [Google Cloud Console](https://console.cloud.google.com/)
- Projeto criado no Supabase
- Acesso ao Dashboard do Supabase

---

## 🚀 Passo a Passo

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em **Select a project** > **NEW PROJECT**
3. Nome do projeto: `Glico` ou qualquer nome de sua escolha
4. Clique em **CREATE**

### 2. Configurar OAuth Consent Screen

1. No menu lateral, vá em **APIs & Services** > **OAuth consent screen**
2. Selecione **External** (para testar com qualquer conta Google)
3. Clique em **CREATE**

**Preencha os dados:**
- **App name:** Glico
- **User support email:** Seu email
- **Developer contact information:** Seu email
- Clique em **SAVE AND CONTINUE**

**Scopes (segunda tela):**
- Clique em **ADD OR REMOVE SCOPES**
- Selecione:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
- Clique em **UPDATE** e depois **SAVE AND CONTINUE**

**Test users (terceira tela):**
- Adicione seu email de teste
- Clique em **SAVE AND CONTINUE**

### 3. Criar OAuth 2.0 Client ID

1. No menu lateral, vá em **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Application type: **Web application**
4. Name: `Glico Web Client`

**Authorized JavaScript origins:**
```
http://localhost:5173
https://dqyzhkftlwecimnnjiim.supabase.co
```

**Authorized redirect URIs:**
```
http://localhost:5173
https://dqyzhkftlwecimnnjiim.supabase.co/auth/v1/callback
```

5. Clique em **CREATE**

**⚠️ IMPORTANTE:** Copie o **Client ID** e **Client Secret** que aparecem na tela!

---

### 4. Configurar no Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto **Glico**
3. No menu lateral, vá em **Authentication** > **Providers**
4. Localize **Google** na lista
5. Clique para expandir e configure:

**Ativar Google Provider:**
- Marque **Enable Sign in with Google**

**Preencha os dados:**
- **Client ID (for OAuth):** Cole o Client ID do Google
- **Client Secret (for OAuth):** Cole o Client Secret do Google

6. Clique em **SAVE**

---

### 5. Configurar URLs de Redirecionamento no Supabase

Ainda em **Authentication** > **URL Configuration**:

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs:**
```
http://localhost:5173/painel
http://localhost:5173
```

Clique em **SAVE**

---

## 📝 Atualizar Frontend

1. No frontend, crie um arquivo `.env` (se ainda não existir):

```bash
cd frontend
cp .env.example .env
```

2. O arquivo `.env` deve conter:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://dqyzhkftlwecimnnjiim.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxeXpoa2Z0bHdlY2ltbm5qaWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1Nzg2NjIsImV4cCI6MjA1NTE1NDY2Mn0.Wkm4KCh1LqiCdVrj1IMDPpSJjyGjKV3xk5tOobxGV7I
```

---

## 🧪 Testar o Login com Google

1. Inicie o backend:
```bash
cd backend
npm run dev
```

2. Inicie o frontend:
```bash
cd frontend
npm run dev
```

3. Acesse http://localhost:5173/login

4. Clique no botão **"Continuar com Google"**

5. Você será redirecionado para a tela de login do Google

6. Após autenticar, será redirecionado de volta para o Glico no `/painel`

---

## 🔍 Verificar Usuário no Supabase

Após fazer login com Google, você pode verificar o usuário:

1. Vá para **Authentication** > **Users** no Dashboard do Supabase
2. Você verá o usuário com:
   - Email do Google
   - Provider: `google`
   - Metadata com foto e nome

---

## ⚠️ Problemas Comuns

### Erro: "redirect_uri_mismatch"
- Verifique se as URLs de redirecionamento no Google Cloud Console estão corretas
- Certifique-se de incluir `https://dqyzhkftlwecimnnjiim.supabase.co/auth/v1/callback`

### Erro: "Access blocked: This app's request is invalid"
- Configure o OAuth Consent Screen no Google Cloud Console
- Adicione seu email como Test User

### Login funciona mas não cria perfil
- O backend cria automaticamente um perfil básico na primeira vez
- Verifique a tabela `profiles` no Supabase

---

## 📚 Referências

- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth API](https://supabase.com/docs/reference/javascript/auth-signinwithoauth)

---

## ✅ Checklist Final

- [ ] Projeto criado no Google Cloud Console
- [ ] OAuth Consent Screen configurado
- [ ] Client ID e Secret criados
- [ ] Google Provider habilitado no Supabase
- [ ] Client ID e Secret inseridos no Supabase
- [ ] URLs de redirecionamento configuradas
- [ ] Arquivo `.env` criado no frontend
- [ ] Testado login com Google com sucesso
- [ ] Usuário aparece em Authentication > Users
- [ ] Perfil criado automaticamente na tabela `profiles`

---

**Pronto! 🎉** O login com Google está configurado e funcionando!
