/**
 * SCHEMA DO BANCO DE DADOS SUPABASE
 * 
 * Execute este SQL no painel do Supabase para criar as tabelas necessárias.
 * 
 * Como usar:
 * 1. Acesse seu projeto no Supabase: https://app.supabase.com
 * 2. Vá em "SQL Editor"
 * 3. Cole este código e execute
 * 
 * Tabelas criadas:
 * - profiles: Dados do perfil do usuário
 * - glicemias: Registros de medições de glicemia
 */

-- ==========================================
-- TABELA DE PERFIS
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  idade INTEGER,
  tipo_diabetes VARCHAR(50), -- 'tipo1', 'tipo2', 'gestacional'
  medicamentos TEXT,
  meta_glicemia_jejum_min INTEGER DEFAULT 80,
  meta_glicemia_jejum_max INTEGER DEFAULT 130,
  meta_glicemia_pos_prandial_max INTEGER DEFAULT 180,
  lembretes_ativos BOOLEAN DEFAULT true,
  horarios_lembretes JSONB DEFAULT '["08:00", "12:00", "18:00", "22:00"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TABELA DE GLICEMIAS
-- ==========================================
CREATE TABLE IF NOT EXISTS glicemias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  valor INTEGER NOT NULL, -- Valor em mg/dL
  categoria VARCHAR(50) NOT NULL, -- 'jejum', 'pre-refeicao', 'pos-prandial', 'antes-dormir'
  observacoes TEXT,
  data_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ÍNDICES PARA PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_glicemias_user_id ON glicemias(user_id);
CREATE INDEX IF NOT EXISTS idx_glicemias_data_hora ON glicemias(data_hora DESC);
CREATE INDEX IF NOT EXISTS idx_glicemias_categoria ON glicemias(categoria);

-- ==========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ==========================================
-- Habilita Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE glicemias ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas para glicemias
CREATE POLICY "Usuários podem ver suas próprias glicemias"
  ON glicemias FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias glicemias"
  ON glicemias FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias glicemias"
  ON glicemias FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias glicemias"
  ON glicemias FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_glicemias_updated_at
  BEFORE UPDATE ON glicemias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- DADOS DE TESTE (OPCIONAL)
-- ==========================================
-- Descomente as linhas abaixo se quiser dados de teste
-- IMPORTANTE: Substitua 'user-uuid-aqui' pelo UUID real do usuário

/*
INSERT INTO glicemias (user_id, valor, categoria, data_hora, observacoes) VALUES
  ('user-uuid-aqui', 177, 'antes-dormir', '2026-02-03 23:33:00', 'Antes de dormir'),
  ('user-uuid-aqui', 150, 'pos-prandial', '2026-02-03 14:00:00', '2h após almoço'),
  ('user-uuid-aqui', 95, 'jejum', '2026-02-03 07:00:00', 'Jejum matinal'),
  ('user-uuid-aqui', 185, 'pos-prandial', '2026-02-02 14:30:00', '2h após almoço'),
  ('user-uuid-aqui', 88, 'jejum', '2026-02-02 07:15:00', 'Jejum matinal'),
  ('user-uuid-aqui', 165, 'pre-refeicao', '2026-02-01 12:00:00', 'Antes do almoço'),
  ('user-uuid-aqui', 120, 'jejum', '2026-02-01 07:30:00', 'Jejum matinal');
*/
