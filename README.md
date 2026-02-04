# 🩺 Glico - Sistema de Autocuidado em Diabetes

Sistema completo para gerenciamento de glicemia em pacientes com diabetes, desenvolvido com React no frontend e Node.js no backend.

## 📋 Visão Geral

O Glico permite que pacientes com diabetes:
- 📝 Registrem medições de glicemia
- 📊 Visualizem gráficos de evolução
- 📈 Acompanhem estatísticas (média, % no alvo, GMI)
- 📄 Gerem relatórios para consultas médicas
- 🔔 Recebam lembretes por e-mail

## 🎨 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para UI
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos
- **CSS3** - Estilização (fonte Poppins)

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Supabase** - Banco de dados PostgreSQL
- **Resend** - Envio de e-mails
- **JWT** - Autenticação

## 📦 Instalação Rápida

### Pré-requisitos
- Node.js 16+ instalado
- Conta no Supabase (gratuita)
- Conta no Resend (gratuita)

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install express cors dotenv helmet morgan @supabase/supabase-js resend
npm install --save-dev nodemon

# Configurar .env
cp .env.example .env
# Edite .env com suas credenciais

# Configurar banco de dados
# Acesse https://app.supabase.com
# Vá em SQL Editor e execute o arquivo database-schema.sql

# Rodar servidor
npm run dev
```

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install react-router-dom axios recharts

# Configurar .env.local
cp .env.example .env.local
# Edite .env.local (normalmente já está correto)

# Rodar aplicação
npm run dev
```

### 3. Acessar

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 🗂️ Estrutura do Projeto

```
appnintment_glicemia/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Serviços (e-mail)
│   │   ├── middleware/      # Autenticação
│   │   └── utils/           # Utilitários
│   ├── server.js            # Entrada do servidor
│   ├── database-schema.sql  # Schema do banco
│   └── README.md            # Documentação backend
│
└── frontend/
    ├── src/
    │   ├── components/      # Componentes reutilizáveis
    │   ├── context/         # Contextos React
    │   ├── pages/           # Páginas principais
    │   ├── services/        # Chamadas de API
    │   ├── styles/          # Estilos globais
    │   ├── App.jsx          # App principal
    │   └── main.jsx         # Entrada
    └── README.md            # Documentação frontend
```

## 🔑 Configuração de Credenciais

### Supabase

1. Acesse https://app.supabase.com
2. Crie um novo projeto (gratuito)
3. Vá em Settings > API
4. Copie:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
5. Vá em SQL Editor e execute `database-schema.sql`

### Resend

1. Acesse https://resend.com
2. Crie uma conta (gratuita)
3. Vá em API Keys
4. Crie uma nova key → `RESEND_API_KEY`
5. Configure um domínio (ou use o domínio de teste)

## 📚 Funcionalidades Principais

### ✅ Implementadas (MVP)

- ✅ Cadastro e login de usuários
- ✅ Registro manual de glicemias
- ✅ Histórico filtrável
- ✅ Gráfico de evolução (7 dias)
- ✅ Gráfico de tempo nos intervalos
- ✅ Estatísticas (média, % no alvo, GMI)
- ✅ Dashboard responsivo
- ✅ Serviço de e-mails configurado

### 🔜 Roadmap Futuro

- 📱 Notificações push
- 💊 Registro de medicamentos
- 🍽️ Registro de alimentação
- 🏃 Registro de atividades físicas
- 📄 Geração de relatórios PDF/Excel
- 📅 Lembretes de consultas
- 🔄 Sincronização com dispositivos

## 🎯 Como Usar

### 1. Cadastrar-se
- Acesse http://localhost:5173/cadastro
- Preencha os dados (nome, email, senha, idade, tipo de diabetes)
- Clique em "Cadastrar"

### 2. Fazer Login
- Acesse http://localhost:5173/login
- Use email e senha cadastrados
- Será redirecionado para o Dashboard

### 3. Registrar Glicemia
- No Dashboard, clique em "Registrar Glicemia"
- Preencha valor, categoria e observações
- Clique em "Salvar"

### 4. Visualizar Dados
- Dashboard mostra estatísticas dos últimos 7 dias
- Gráfico de evolução mostra todas as medições
- Cards mostram: última medição, % no alvo, média e GMI

## 🛠️ Manutenção e Desenvolvimento

### Adicionar Nova Funcionalidade

#### Backend (API)
1. Crie controller em `backend/src/controllers/`
2. Crie rota em `backend/src/routes/`
3. Registre no `server.js`

#### Frontend (Interface)
1. Crie componente em `frontend/src/components/` ou página em `frontend/src/pages/`
2. Crie arquivo CSS correspondente
3. Adicione rota no `App.jsx` (se for página)

### Modificar Estilos

- **Cores**: Edite `frontend/src/styles/variables.css`
- **Estilos globais**: Edite `frontend/src/styles/global.css`
- **Estilos de componente**: Edite o CSS do componente específico

### Modificar Banco de Dados

1. Faça alterações no Supabase SQL Editor
2. Atualize `backend/database-schema.sql`
3. Atualize controllers/serviços conforme necessário

## 🐛 Resolução de Problemas Comuns

**Backend não inicia**
- Verifique se o arquivo `.env` existe
- Verifique se todas as variáveis estão preenchidas
- Execute `npm install` novamente

**Frontend não conecta com backend**
- Verifique se o backend está rodando
- Verifique `VITE_API_URL` no `.env.local`
- Verifique `CORS_ORIGIN` no backend `.env`

**Erro ao fazer login**
- Verifique se criou as tabelas no Supabase
- Verifique se as credenciais do Supabase estão corretas
- Veja os logs do backend para mais detalhes

**Gráficos não aparecem**
- Instale recharts: `npm install recharts`
- Verifique console do navegador para erros

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte os arquivos README de backend e frontend
2. Verifique os comentários nos arquivos de código
3. Veja a seção de resolução de problemas

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e uso pessoal.

---

**Desenvolvido com ❤️ para ajudar pessoas com diabetes a terem melhor qualidade de vida**
