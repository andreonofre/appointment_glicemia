# 🚀 GUIA RÁPIDO DE INSTALAÇÃO - Glico

## ⚡ Instalação Rápida (Copy & Paste)

### 1️⃣ BACKEND

```bash
# Navegar para o backend
cd backend

# Instalar TODAS as dependências de uma vez
npm install express cors dotenv helmet morgan @supabase/supabase-js resend nodemon

# Copiar arquivo de configuração
cp .env.example .env

# ⚠️ IMPORTANTE: Edite o arquivo .env com suas credenciais
# Use notepad, VS Code ou qualquer editor de texto
```

### 2️⃣ FRONTEND

```bash
# Navegar para o frontend
cd frontend

# Instalar TODAS as dependências de uma vez
npm install react-router-dom axios recharts

# Copiar arquivo de configuração
cp .env.example .env.local

# ✅ Normalmente não precisa editar .env.local
```

### 3️⃣ CONFIGURAR BANCO DE DADOS

1. Acesse https://app.supabase.com
2. Crie um projeto novo (gratuito)
3. Vá em **SQL Editor**
4. Abra o arquivo `backend/database-schema.sql`
5. Copie todo o conteúdo
6. Cole no SQL Editor do Supabase
7. Clique em **Run**

### 4️⃣ OBTER CREDENCIAIS

#### Supabase:
1. No Supabase, vá em **Settings** > **API**
2. Copie:
   - **Project URL** → Cole em `SUPABASE_URL` no .env
   - **anon public** → Cole em `SUPABASE_ANON_KEY` no .env
   - **service_role** → Cole em `SUPABASE_SERVICE_ROLE_KEY` no .env

#### Resend (E-mails):
1. Acesse https://resend.com
2. Crie uma conta (gratuita)
3. Vá em **API Keys** > **Create API Key**
4. Copie a chave → Cole em `RESEND_API_KEY` no .env
5. Configure um e-mail remetente → Cole em `FROM_EMAIL` no .env

### 5️⃣ RODAR O PROJETO

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Deve aparecer:
```
🩺  Servidor Glico iniciado com sucesso!
🩺  Porta: 3000
🩺  URL: http://localhost:3000
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Deve aparecer:
```
  VITE ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

### 6️⃣ ACESSAR

1. Abra o navegador em **http://localhost:5173**
2. Clique em "Cadastre-se"
3. Crie sua conta
4. Faça login
5. Comece a usar! 🎉

---

## 📦 Lista Completa de Dependências

### Backend (Node.js)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "@supabase/supabase-js": "^2.39.0",
    "resend": "^3.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### Frontend (React)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "recharts": "^2.10.3"
  }
}
```

---

## 🔧 Comandos Úteis

### Backend
```bash
npm run dev      # Rodar em modo desenvolvimento (auto-reload)
npm start        # Rodar em modo produção
```

### Frontend
```bash
npm run dev      # Rodar em modo desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

---

## ✅ Checklist de Instalação

- [ ] Node.js instalado (versão 16+)
- [ ] Backend: dependências instaladas
- [ ] Backend: arquivo .env configurado
- [ ] Supabase: projeto criado
- [ ] Supabase: tabelas criadas (database-schema.sql executado)
- [ ] Resend: conta criada e API key obtida
- [ ] Frontend: dependências instaladas
- [ ] Frontend: arquivo .env.local criado
- [ ] Backend rodando em http://localhost:3000
- [ ] Frontend rodando em http://localhost:5173

---

## 🆘 Problemas Comuns

### ❌ "Cannot find module 'express'"
**Solução:** Rode `npm install` no backend

### ❌ "Network Error" no frontend
**Solução:** Certifique-se que o backend está rodando

### ❌ "Supabase credentials missing"
**Solução:** Verifique se o arquivo .env existe e está preenchido

### ❌ Gráficos não aparecem
**Solução:** Instale recharts: `npm install recharts`

### ❌ "Port 3000 already in use"
**Solução:** Mude a porta no .env do backend ou mate o processo

---

## 📞 Precisa de Ajuda?

1. Leia os arquivos README:
   - `README.md` (raiz)
   - `backend/README.md`
   - `frontend/README.md`

2. Verifique os comentários nos arquivos de código

3. Todos os arquivos têm comentários explicativos!

---

**Desenvolvido com ❤️ para facilitar a vida de pessoas com diabetes**
