# 🔄 Instruções de Atualização do Sistema Glico

## 📋 Resumo das Mudanças Implementadas

### ✅ 1. Melhorias na Tela de Login
- ✅ Removidos os dados de teste
- ✅ Aumentada a largura do card de login (450px → 550px)
- ✅ Interface mais limpa e profissional

### ✅ 2. Novas Categorias de Medição
As categorias foram atualizadas para:
- Jejum
- Antes das refeições
- Pós-prandial (1h)
- Pós-prandial (2h)
- Antes de dormir
- Madrugada
- Outros

### ✅ 3. Campo Medicamentos/Insulina Aprimorado
Agora com lista suspensa contendo:
- Insulina Basal
- Insulina Basal Rápida
- Medicamento Oral
- Outro (com campo livre para digitação)

### ✅ 4. Cadastro de Perfil Completo
Novos campos adicionados:
- Nome completo
- Data de nascimento
- Endereço
- Contato (telefone)
- Lista de medicamentos em uso (opcional)
- Metas glicêmicas personalizadas (obrigatório):
  - Glicemia em jejum mínima
  - Glicemia em jejum máxima
  - Pós-prandial máximo
  - Glicemia mínima aceitável
  - Glicemia máxima aceitável
- Consentimento:
  - Aceite dos Termos de Uso
  - Aceite da Política de Privacidade (LGPD)

### ✅ 5. Páginas Legais
Criadas páginas completas de:
- Termos de Uso
- Política de Privacidade e Proteção de Dados (LGPD)

### ✅ 6. Gráficos com Metas Personalizadas
Os gráficos agora utilizam as metas glicêmicas personalizadas de cada usuário.

---

## 🗄️ Atualização do Banco de Dados

### Passo 1: Adicionar Novos Campos na Tabela `profiles`

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá em **SQL Editor**
3. Execute o arquivo: `backend/database-update-perfil.sql`

Este script adiciona os seguintes campos:
- `data_nascimento` - Data de nascimento
- `endereco` - Endereço completo
- `contato` - Telefone de contato
- `medicamentos_uso` - Medicamentos em uso
- `meta_jejum_min` - Meta jejum mínima
- `meta_jejum_max` - Meta jejum máxima
- `meta_pos_prandial_max` - Meta pós-prandial máxima
- `meta_glicemia_min` - Glicemia mínima aceitável
- `meta_glicemia_max` - Glicemia máxima aceitável
- `aceite_termos` - Aceite dos termos
- `aceite_privacidade` - Aceite da política de privacidade

### Passo 2: Criar Trigger para Perfis Automáticos

1. No **SQL Editor** do Supabase
2. Execute o arquivo: `backend/database-trigger-perfil.sql`

Este script cria uma função e trigger que:
- Cria automaticamente o perfil na tabela `profiles` quando um usuário se cadastra
- Copia os dados do `user_metadata` para a tabela `profiles`
- Garante que todos os novos usuários tenham um perfil completo

---

## 🚀 Como Testar

### 1. Teste o Cadastro
1. Acesse a página de cadastro
2. Preencha todos os campos obrigatórios
3. Configure suas metas glicêmicas personalizadas
4. Aceite os termos de uso e política de privacidade
5. Complete o cadastro

### 2. Teste as Categorias
1. Faça login
2. Vá em "Registrar"
3. Verifique se as novas categorias aparecem no dropdown "Momento"

### 3. Teste os Medicamentos
1. No formulário de registro de glicemia
2. Verifique se o campo "Medicamentos/Insulina" tem as opções:
   - Insulina Basal
   - Insulina Basal Rápida
   - Medicamento Oral
   - Outro (mostra campo livre)

### 4. Teste os Gráficos
1. Registre algumas medições de glicemia
2. Acesse "Gráficos"
3. Verifique se as linhas de referência nos gráficos usam suas metas personalizadas

### 5. Teste as Páginas Legais
1. Na tela de cadastro, clique em "Termos de Uso"
2. Clique em "Política de Privacidade (LGPD)"
3. Verifique se as páginas abrem corretamente

---

## 📝 Arquivos Modificados

### Frontend (React)

**Páginas:**
- `frontend/src/pages/Login.jsx` - Removidos dados de teste
- `frontend/src/pages/Login.css` - Aumentada largura
- `frontend/src/pages/Register.jsx` - Formulário completo com novos campos
- `frontend/src/pages/Register.css` - Estilos para seções e checkboxes
- `frontend/src/pages/TermosUso.jsx` - **NOVO**
- `frontend/src/pages/TermosUso.css` - **NOVO**
- `frontend/src/pages/PoliticaPrivacidade.jsx` - **NOVO**
- `frontend/src/pages/Graficos.jsx` - Busca metas do usuário

**Componentes:**
- `frontend/src/components/RegistrarModal.jsx` - Novas categorias e medicamentos
- `frontend/src/components/GlicemiaChart.jsx` - Usa metas personalizadas
- `frontend/src/components/IntervalosChart.jsx` - Usa metas personalizadas

**Serviços:**
- `frontend/src/services/supabaseAuthService.js` - Cadastro com novos campos
- `frontend/src/services/profileService.js` - **NOVO** - Gerencia perfil do usuário

**Roteamento:**
- `frontend/src/App.jsx` - Rotas para páginas legais

### Backend (SQL)

**Scripts de Atualização:**
- `backend/database-update-perfil.sql` - **NOVO** - Adiciona novos campos
- `backend/database-trigger-perfil.sql` - **NOVO** - Cria perfil automático

---

## ⚠️ Observações Importantes

### Usuários Existentes
Para usuários que já existem no sistema antes desta atualização:
1. Os novos campos terão valores padrão
2. Eles podem atualizar seu perfil posteriormente (quando implementarmos a página de configurações)
3. As metas glicêmicas usarão os valores padrão:
   - Jejum: 70-100 mg/dL
   - Pós-prandial: 140 mg/dL
   - Mínimo geral: 70 mg/dL
   - Máximo geral: 180 mg/dL

### Categorias Antigas
Se houver medições com categorias antigas no banco:
- `pre-refeicao` → Será exibido como "pre-refeicao"
- `pos-prandial` → Será exibido como "pos-prandial"

Recomenda-se criar um script de migração se necessário.

---

## 🔒 Conformidade LGPD

As páginas de Termos de Uso e Política de Privacidade foram criadas seguindo:
- Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)
- Melhores práticas de transparência
- Direitos dos titulares de dados

**Importante:** Revise e adapte os textos legais conforme a realidade e aconselhamento jurídico da sua organização.

---

## 🆘 Suporte

Se encontrar algum problema:
1. Verifique se todos os scripts SQL foram executados
2. Verifique o console do navegador para erros
3. Verifique os logs do Supabase

---

## ✨ Próximas Melhorias Sugeridas

1. Página de Configurações de Perfil (editar dados pessoais e metas)
2. Script de migração de categorias antigas
3. Validação de telefone com máscara
4. Upload de foto de perfil
5. Exportação de dados (direito LGPD)
6. Sistema de notificações por email

---

**Desenvolvido com ❤️ para o sistema Glico**
