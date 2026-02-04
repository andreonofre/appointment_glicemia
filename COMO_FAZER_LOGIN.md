# 🔐 Como Fazer Login no Glico

Existem **2 formas** de fazer login no sistema Glico:

---

## 1️⃣ Login com Email e Senha (Cadastro Manual)

### Passo 1: Cadastrar-se

1. Acesse http://localhost:5173/cadastro
2. Preencha o formulário:
   - Nome completo
   - Email
   - Senha
   - Idade (opcional)
   - Tipo de diabetes (opcional)
3. Clique em **"Cadastrar"**

### Passo 2: Verificar Email

1. Você receberá um email com **código de 6 dígitos**
2. Abra seu email e copie o código
3. Será redirecionado automaticamente para tela de verificação
4. Digite ou cole o código nos 6 campos
5. Clique em **"Verificar Código"**

> ⚠️ **IMPORTANTE:** O código expira em 15 minutos!

### Passo 3: Fazer Login

1. Após verificar o código, você será redirecionado para `/login`
2. Digite seu **email** e **senha**
3. Clique em **"Entrar"**
4. Pronto! Você será redirecionado para o painel `/painel`

---

## 2️⃣ Login com Google (OAuth)

### Configuração Inicial (Fazer uma vez)

Antes de usar o login do Google, é necessário configurar:

1. Siga o guia completo em: **CONFIGURACAO_GOOGLE_OAUTH.md**
2. Configure OAuth no Google Cloud Console
3. Configure Provider Google no Supabase
4. Adicione credenciais no `.env` do frontend

### Fazendo Login

1. Acesse http://localhost:5173/login
2. Clique no botão **"Continuar com Google"**
3. Selecione sua conta Google
4. Autorize o acesso ao Glico
5. Pronto! Você será redirecionado para o painel `/painel`

> 📝 **NOTA:** No primeiro login com Google, um perfil básico é criado automaticamente.

---

## 🔄 Fluxo Simplificado

### Cadastro Manual (com verificação)
```
Cadastro → Recebe código por email → Verifica código → Login → Painel
```

### Google OAuth
```
Click "Google" → Autentica Google → Painel
```

---

## ❓ FAQ - Perguntas Frequentes

### Como saber qual método de login usei?

Verifique no Supabase Dashboard:
- **Authentication > Users**
- Veja a coluna **Provider**:
  - `email` = Cadastro manual
  - `google` = Login com Google

### Posso usar os dois métodos com mesmo email?

Não recomendado. Se você:
1. Criar conta manual com `maria@gmail.com`
2. Depois fazer login com Google usando `maria@gmail.com`

Terá **2 contas diferentes** no sistema.

### Esqueci minha senha (cadastro manual)

Por enquanto, não temos recuperação de senha. Você pode:
1. Usar login com Google (se tiver Gmail)
2. Criar nova conta com outro email

> 🚧 **Em desenvolvimento:** Sistema de recuperação de senha

### Email de verificação não chegou

1. Verifique pasta de **spam/lixo eletrônico**
2. Aguarde até 5 minutos
3. Na tela de verificação, clique em **"Reenviar código"**
4. Se persistir, verifique se o Resend está configurado no backend

### Código expirou

1. Volte para a tela de cadastro
2. Cadastre-se novamente com mesmo email
3. Um novo código será enviado
4. O código anterior é invalidado automaticamente

---

## 🧪 Dados de Teste

### Usuário de Teste (Manual)

Se já existir no banco:

```
Email: teste@glico.com
Senha: teste123
```

### Google Test User

Configure no Google Cloud Console > OAuth Consent Screen > Test Users.

---

## 🛠️ Checklist Antes de Fazer Login

### Backend
- [ ] Backend rodando em http://localhost:3000
- [ ] Arquivo `.env` configurado com Supabase e Resend
- [ ] Tabelas criadas no Supabase:
  - [ ] `profiles`
  - [ ] `verification_codes`

### Frontend
- [ ] Frontend rodando em http://localhost:5173
- [ ] Arquivo `.env` criado (se usar Google OAuth)
- [ ] Dependências instaladas (`npm install`)

### Supabase
- [ ] Authentication habilitado
- [ ] Email Auth habilitado (para cadastro manual)
- [ ] Google Provider configurado (para OAuth)

### Resend
- [ ] API Key válida
- [ ] Email de origem configurado

---

## 📚 Documentos Relacionados

- **CONFIGURACAO_GOOGLE_OAUTH.md** - Como configurar login do Google
- **SISTEMA_VERIFICACAO_EMAIL.md** - Detalhes do sistema de verificação
- **CONFIGURACAO_CREDENCIAIS.md** - Como obter credenciais Supabase/Resend
- **INSTALACAO.md** - Como instalar e rodar o projeto

---

## 🎯 Resumo Rápido

### Primeira vez usando o Glico?

**Opção 1: Cadastro Manual**
1. Cadastre-se com email e senha
2. Verifique email (código de 6 dígitos)
3. Faça login

**Opção 2: Google OAuth (mais rápido)**
1. Configure Google OAuth (uma vez)
2. Click "Continuar com Google"
3. Pronto!

### Já tem conta?

1. Acesse `/login`
2. Digite email e senha OU clique no botão Google
3. Entre no painel

---

**Pronto para começar! 🚀**

Se tiver dúvidas, consulte os documentos listados acima ou abra uma issue no projeto.
