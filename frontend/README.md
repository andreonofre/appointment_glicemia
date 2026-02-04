# 🩺 Glico - Sistema de Autocuidado em Diabetes

## Frontend (React + Vite)

### 📋 Dependências Necessárias

#### Dependências de Produção
```bash
npm install react-router-dom
npm install axios
npm install recharts
```

**Descrição das dependências:**
- **react-router-dom**: Gerenciamento de rotas
- **axios**: Cliente HTTP para comunicação com API
- **recharts**: Biblioteca de gráficos para React

---

### 🚀 Como Instalar e Rodar

#### 1. Instalar dependências
```bash
cd frontend
npm install react-router-dom axios recharts
```

#### 2. Configurar variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local
```

**Variáveis necessárias no .env.local:**
```
VITE_API_URL=http://localhost:3000/api
```

#### 3. Rodar o frontend
```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

O frontend estará rodando em: **http://localhost:5173**

---

### 📁 Estrutura de Pastas

```
frontend/
├── src/
│   ├── assets/          # Imagens, ícones
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Sidebar.jsx
│   │   ├── Sidebar.css
│   │   ├── StatsCard.jsx
│   │   ├── StatsCard.css
│   │   ├── GlicemiaChart.jsx
│   │   ├── GlicemiaChart.css
│   │   ├── IntervalosChart.jsx
│   │   ├── IntervalosChart.css
│   │   ├── RegistrarModal.jsx
│   │   └── RegistrarModal.css
│   ├── context/         # Contextos React
│   │   └── AuthContext.jsx
│   ├── pages/           # Páginas principais
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Register.jsx
│   │   ├── Register.css
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── services/        # Serviços de API
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── glicemiaService.js
│   ├── styles/          # Estilos globais
│   │   ├── variables.css
│   │   └── global.css
│   ├── utils/           # Funções utilitárias
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Ponto de entrada
├── public/              # Arquivos estáticos
├── index.html
├── .env.example
├── .env.local           # Suas variáveis (NÃO commitar!)
├── .gitignore
├── package.json
└── vite.config.js
```

---

### 🎨 Sistema de Cores (Variáveis CSS)

As cores estão definidas em `src/styles/variables.css`:

- **Primária (Teal)**: `--color-primary` (#2D9A9A)
- **Verde (No alvo)**: `--color-success` (#2ECC71)
- **Laranja (Alto)**: `--color-warning` (#F39C12)
- **Vermelho (Muito alto/baixo)**: `--color-danger` (#E74C3C)

Para alterar cores, edite o arquivo `variables.css`.

---

### 🔧 Como Fazer Manutenção

#### Adicionar nova página:
1. Crie o componente em `src/pages/NomeDaPagina.jsx`
2. Crie o CSS em `src/pages/NomeDaPagina.css`
3. Adicione a rota no `App.jsx`

#### Criar novo componente:
1. Crie o arquivo em `src/components/NomeDoComponente.jsx`
2. Crie o CSS em `src/components/NomeDoComponente.css`
3. Importe onde precisar: `import NomeDoComponente from './components/NomeDoComponente'`

#### Adicionar nova chamada de API:
1. Edite o serviço apropriado em `src/services/`
2. Use o hook useAuth() para acessar dados do usuário

#### Modificar estilos globais:
1. Edite `src/styles/global.css` para estilos gerais
2. Edite `src/styles/variables.css` para cores, fontes, etc

---

### 🧩 Componentes Principais

#### Sidebar
Menu lateral de navegação. Aparece em todas as páginas autenticadas.

#### StatsCard
Cartão de estatística reutilizável (usado no Dashboard).

**Props:**
- `icon`: Emoji ou ícone
- `label`: Texto descritivo
- `value`: Valor numérico
- `unit`: Unidade (mg/dL, %, etc)
- `color`: Cor do tema (primary, success, warning, info)

#### GlicemiaChart
Gráfico de linha com evolução das glicemias.

**Props:**
- `data`: Array de objetos com glicemias

#### IntervalosChart
Gráfico de barras mostrando tempo nos intervalos.

**Props:**
- `stats`: Objeto com estatísticas

#### RegistrarModal
Modal para registrar nova glicemia.

**Props:**
- `onClose`: Função chamada ao fechar
- `onSuccess`: Função chamada após salvar

---

### 🎯 Contextos

#### AuthContext
Gerencia autenticação do usuário.

**Como usar:**
```jsx
import { useAuth } from '../context/AuthContext';

function MeuComponente() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // user: dados do usuário logado
  // login(email, password): função para login
  // logout(): função para logout
  // isAuthenticated: boolean se está logado
}
```

---

### 📱 Responsividade

O aplicativo é totalmente responsivo:
- **Desktop**: Sidebar fixa à esquerda
- **Tablet/Mobile**: Sidebar no topo, menu horizontal

Breakpoints em `variables.css`:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

---

### 🆘 Resolução de Problemas

**Erro: "Network Error" ao fazer login**
- Verifique se o backend está rodando (http://localhost:3000)
- Verifique a variável `VITE_API_URL` no `.env.local`

**Erro: "Module not found"**
- Execute `npm install` para instalar todas as dependências

**Gráficos não aparecem**
- Verifique se instalou `recharts`: `npm install recharts`

**Estilos não aplicados**
- Verifique se importou os arquivos CSS nos componentes
- Verifique se `global.css` está importado no `App.jsx`

---

### 📝 Dados de Teste

Para testar o login, use:
- **Email**: teste@glico.com
- **Senha**: teste123

(Você precisa criar esse usuário no cadastro ou direto no Supabase)

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
