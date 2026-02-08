/**
 * DADOS MOCKADOS PARA TESTE - GLICEMIA
 * 
 * Script para popular banco com dados de teste realistas
 * 
 * COMO USAR:
 * 1. Copie todo este conteúdo
 * 2. Vá no Supabase SQL Editor
 * 3. Cole e execute o script
 * 
 * DADOS CRIADOS:
 * - Usuário de teste: test.user@gmail.com
 * - Senha: TestUser123!
 * - 96 registros de glicemia (últimos 30 dias)
 * - Medições em diferentes momentos do dia
 */

-- ====================================
-- ATENÇÃO: SUBSTITUA O UUID ABAIXO
-- ====================================
-- Primeiro, pegue o UUID do seu usuário executando:
-- SELECT id, email FROM auth.users WHERE email = 'seu-email@gmail.com';
-- 
-- Depois substitua 'SEU_USER_ID_AQUI' pelo UUID retornado

DO $$
DECLARE
    v_user_id UUID := 'SEU_USER_ID_AQUI'; -- SUBSTITUIR PELO SEU UUID REAL
    v_data_base DATE := CURRENT_DATE;
    v_data_atual DATE;
    v_hora_base TIME;
    i INTEGER;
BEGIN
    -- Remove dados mockados anteriores (se existirem)
    DELETE FROM glicemias 
    WHERE user_id = v_user_id 
    AND observacoes LIKE '%[TESTE]%';

    -- Últimos 30 dias com medições
    FOR i IN 0..29 LOOP
        v_data_atual := v_data_base - i;
        
        -- JEJUM (7h00 - 7h30) - Café da manhã
        IF random() > 0.15 THEN -- 85% de chance
            INSERT INTO glicemias (user_id, valor, categoria, data_hora, medicamentos, observacoes)
            VALUES (
                v_user_id,
                70 + floor(random() * 100)::int, -- 70-170
                'jejum',
                v_data_atual + (TIME '07:00:00' + (random() * INTERVAL '30 minutes')),
                CASE WHEN random() > 0.5 THEN 'Insulina NPH' ELSE NULL END,
                '[TESTE] Medição de jejum'
            );
        END IF;
        
        -- PÓS-PRANDIAL 2H CAFÉ (9h00 - 10h00) 
        IF random() > 0.20 THEN -- 80% de chance
            INSERT INTO glicemias (user_id, valor, categoria, data_hora, medicamentos, observacoes)
            VALUES (
                v_user_id,
                100 + floor(random() * 120)::int, -- 100-220
                'pos-prandial-2h',
                v_data_atual + (TIME '09:00:00' + (random() * INTERVAL '60 minutes')),
                NULL,
                '[TESTE] 2h após café da manhã'
            );
        END IF;
        
        -- ANTES ALMOÇO (11h30 - 12h30)
        IF random() > 0.25 THEN -- 75% de chance
            INSERT INTO glicemias (user_id, valor, categoria, data_hora, medicamentos, observacoes)
            VALUES (
                v_user_id,
                80 + floor(random() * 100)::int, -- 80-180
                'antes-refeicoes',
                v_data_atual + (TIME '11:30:00' + (random() * INTERVAL '60 minutes')),
                CASE WHEN random() > 0.6 THEN 'Insulina Regular' ELSE NULL END,
                '[TESTE] Antes do almoço'
            );
        END IF;
        
        -- PÓS-PRANDIAL 2H ALMOÇO (14h00 - 15h00)
        IF random() > 0.20 THEN -- 80% de chance
            INSERT INTO glicemias (user_id, valor, categoria, data_hora, medicamentos, observacoes)
            VALUES (
                v_user_id,
                90 + floor(random() * 140)::int, -- 90-230
                'pos-prandial-2h',
                v_data_atual + (TIME '14:00:00' + (random() * INTERVAL '60 minutes')),
                NULL,
                '[TESTE] 2h após almoço'
            );
        END IF;
        
        -- ANTES JANTAR (18h30 - 19h30)
        IF random() > 0.30 THEN -- 70% de chance
            INSERT INTO glicemias (user_id, valor, categoria, data_hora, medicamentos, observacoes)
            VALUES (
                v_user_id,
                85 + floor(random() * 95)::int, -- 85-180
                'antes-refeicoes',
                v_data_atual + (TIME '18:30:00' + (random() * INTERVAL '60 minutes')),
                CASE WHEN random() > 0.6 THEN 'Insulina Regular' ELSE NULL END,
                '[TESTE] Antes do jantar'
            );
        END IF;
        
        -- PÓS-PRANDIAL 2H JANTAR (20h30 - 21h30)
        IF random() > 0.25 THEN -- 75% de chance
            INSERT INTO glicemias (user_id, valor, categoria, data_hora, medicamentos, observacoes)
            VALUES (
                v_user_id,
                95 + floor(random() * 135)::int, -- 95-230
                'pos-prandial-2h',
                v_data_atual + (TIME '20:30:00' + (random() * INTERVAL '60 minutes')),
                NULL,
                '[TESTE] 2h após jantar'
            );
        END IF;
        
        -- AO DEITAR (22h00 - 23h00)
        IF random() > 0.35 THEN -- 65% de chance
            INSERT INTO glicemias (user_id, valor, categoria, data_hora, medicamentos, observacoes)
            VALUES (
                v_user_id,
                90 + floor(random() * 120)::int, -- 90-210
                'antes-dormir',
                v_data_atual + (TIME '22:00:00' + (random() * INTERVAL '60 minutes')),
                CASE WHEN random() > 0.7 THEN 'Insulina NPH' ELSE NULL END,
                '[TESTE] Antes de dormir'
            );
        END IF;
        
        -- MADRUGADA (3h00 - 4h00) - Apenas algumas noites
        IF random() > 0.70 THEN -- 30% de chance
            INSERT INTO glicemias (user_id, valor, categoria, data_hora, medicamentos, observacoes)
            VALUES (
                v_user_id,
                70 + floor(random() * 90)::int, -- 70-160
                'madrugada',
                v_data_atual + (TIME '03:00:00' + (random() * INTERVAL '60 minutes')),
                NULL,
                '[TESTE] Madrugada'
            );
        END IF;
        
    END LOOP;
    
    RAISE NOTICE 'Dados mockados inseridos com sucesso!';
    RAISE NOTICE 'Total de registros criados: %', (SELECT COUNT(*) FROM glicemias WHERE user_id = v_user_id AND observacoes LIKE '%[TESTE]%');
END $$;

-- Verificar dados inseridos
SELECT 
    DATE(data_hora) as data,
    COUNT(*) as total_medicoes,
    ROUND(AVG(valor)) as media,
    MIN(valor) as minimo,
    MAX(valor) as maximo
FROM glicemias 
WHERE observacoes LIKE '%[TESTE]%'
GROUP BY DATE(data_hora)
ORDER BY data DESC
LIMIT 10;
