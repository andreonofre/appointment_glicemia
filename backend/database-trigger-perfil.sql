/**
 * FUNÇÃO E TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
 * 
 * Execute este SQL no painel do Supabase para criar automaticamente
 * o perfil do usuário na tabela profiles quando ele se cadastrar.
 * 
 * Como usar:
 * 1. Acesse seu projeto no Supabase: https://app.supabase.com
 * 2. Vá em "SQL Editor"
 * 3. Cole este código e execute
 */

-- ==========================================
-- FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    nome, 
    email, 
    idade,
    data_nascimento,
    endereco,
    contato,
    tipo_diabetes,
    medicamentos_uso,
    meta_jejum_min,
    meta_jejum_max,
    meta_pos_prandial_max,
    meta_glicemia_min,
    meta_glicemia_max,
    aceite_termos,
    aceite_privacidade
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'idade')::INTEGER, NULL),
    COALESCE((NEW.raw_user_meta_data->>'data_nascimento')::DATE, NULL),
    COALESCE(NEW.raw_user_meta_data->>'endereco', NULL),
    COALESCE(NEW.raw_user_meta_data->>'contato', NULL),
    COALESCE(NEW.raw_user_meta_data->>'tipo_diabetes', 'tipo2'),
    COALESCE(NEW.raw_user_meta_data->>'medicamentos_uso', NULL),
    COALESCE((NEW.raw_user_meta_data->>'meta_jejum_min')::INTEGER, 70),
    COALESCE((NEW.raw_user_meta_data->>'meta_jejum_max')::INTEGER, 100),
    COALESCE((NEW.raw_user_meta_data->>'meta_pos_prandial_max')::INTEGER, 140),
    COALESCE((NEW.raw_user_meta_data->>'meta_glicemia_min')::INTEGER, 70),
    COALESCE((NEW.raw_user_meta_data->>'meta_glicemia_max')::INTEGER, 180),
    COALESCE((NEW.raw_user_meta_data->>'aceite_termos')::BOOLEAN, false),
    COALESCE((NEW.raw_user_meta_data->>'aceite_privacidade')::BOOLEAN, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- TRIGGER PARA EXECUTAR A FUNÇÃO
-- ==========================================

-- Remove trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Cria novo trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- MENSAGEM DE SUCESSO
-- ==========================================
DO $$
BEGIN
  RAISE NOTICE '✅ Trigger criado com sucesso!';
  RAISE NOTICE '📝 Perfis serão criados automaticamente ao cadastrar novos usuários';
END $$;
