# 🩺 Glico - Sistema de Autocuidado em Diabetes

## Backend (Node.js)

### 📋 Dependências Necessárias

#### Dependências de Produção
```bash
npm install express cors dotenv helmet morgan
npm install @supabase/supabase-js
npm install resend
```

**Descrição das dependências:**
- **express**: Framework web para Node.js
- **cors**: Permite requisições cross-origin (frontend → backend)
- **dotenv**: Carrega variáveis de ambiente do arquivo .env
- **helmet**: Adiciona segurança com headers HTTP
- **morgan**: Logger de requisições HTTP
- **@supabase/supabase-js**: Cliente para comunicação com Supabase
- **resend**: Serviço de envio de e-mails

#### Dependências de Desenvolvimento
```bash
npm install --save-dev nodemon
```

**Descrição:**
- **nodemon**: Reinicia o servidor automaticamente ao detectar mudanças

---

### 🚀 Como Instalar e Rodar

#### 1. Instalar dependências
```bash
cd backend
npm install express cors dotenv helmet morgan @supabase/supabase-js resend
npm install --save-dev nodemon
```

#### 2. Configurar variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas credenciais
```

**Variáveis necessárias no .env:**
- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase
- `RESEND_API_KEY`: Chave de API do Resend
- `JWT_SECRET`: Segredo para tokens JWT
- `FROM_EMAIL`: E-mail remetente

#### 3. Configurar banco de dados
```bash
# Acesse o Supabase em https://app.supabase.com
# Vá em SQL Editor
# Execute o arquivo database-schema.sql
```

#### 4. Adicionar script no package.json
Edite `package.json` e adicione na seção "scripts":

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### 5. Rodar o servidor
```bash
# Modo desenvolvimento (reinicia automaticamente)
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em: **http://localhost:3000**

---

### 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/          # Configurações (Supabase, Resend)
│   ├── controllers/     # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── services/        # Serviços (e-mail, etc)
│   ├── middleware/      # Middlewares (autenticação)
│   └── utils/           # Utilitários
├── server.js            # Arquivo principal
├── database-schema.sql  # Schema do banco
├── .env.example         # Exemplo de variáveis
├── .env                 # Suas variáveis (NÃO commitar!)
├── .gitignore
└── package.json
```

---

### 🔧 Como Fazer Manutenção

#### Adicionar nova rota:
1. Crie um controller em `src/controllers/`
2. Crie uma rota em `src/routes/`
3. Registre a rota no `server.js`

#### Modificar banco de dados:
1. Faça as alterações no Supabase SQL Editor
2. Atualize o arquivo `database-schema.sql`

#### Adicionar novo tipo de e-mail:
1. Edite `src/services/emailService.js`
2. Crie uma nova função de envio

---

### 📚 Endpoints da API

#### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário (protegida)

#### Glicemias
- `POST /api/glicemias` - Criar registro (protegida)
- `GET /api/glicemias` - Listar registros (protegida)
- `GET /api/glicemias/stats` - Estatísticas (protegida)
- `GET /api/glicemias/:id` - Buscar registro (protegida)
- `PUT /api/glicemias/:id` - Atualizar registro (protegida)
- `DELETE /api/glicemias/:id` - Deletar registro (protegida)

---

### 🆘 Resolução de Problemas

**Erro: "Faltam as credenciais do Supabase"**
- Verifique se o arquivo `.env` existe
- Verifique se as variáveis estão preenchidas

**Erro: "CORS"**
- Verifique a variável `CORS_ORIGIN` no `.env`
- Deve ser a URL do frontend (ex: http://localhost:5173)

**Erro ao enviar e-mail**
- Verifique a `RESEND_API_KEY`
- Verifique se o domínio está configurado no Resend
