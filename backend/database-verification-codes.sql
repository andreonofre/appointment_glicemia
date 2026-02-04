-- =====================================================
-- TABELA DE CÓDIGOS DE VERIFICAÇÃO
-- =====================================================
-- Esta tabela armazena códigos temporários de verificação
-- para validação de email durante o cadastro

CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(6) NOT NULL,
  user_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);

-- Índice para busca por código
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_verification_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_verification_codes_updated_at
  BEFORE UPDATE ON verification_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_verification_codes_updated_at();

-- Comentários explicativos
COMMENT ON TABLE verification_codes IS 'Armazena códigos de verificação para cadastro de usuários';
COMMENT ON COLUMN verification_codes.email IS 'Email do usuário que está se cadastrando';
COMMENT ON COLUMN verification_codes.code IS 'Código de 6 dígitos enviado por email';
COMMENT ON COLUMN verification_codes.user_data IS 'Dados do usuário em formato JSON (nome, senha, etc.)';
COMMENT ON COLUMN verification_codes.expires_at IS 'Data/hora de expiração do código (15 minutos)';
COMMENT ON COLUMN verification_codes.verified IS 'Flag indicando se o código já foi verificado';
