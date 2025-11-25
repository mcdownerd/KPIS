-- Script de importação em massa de produtos
-- Execute este script no Supabase SQL Editor

-- IMPORTANTE: Este script insere TODOS os produtos do CSV
-- Os produtos já estão associados às lojas corretas (Queluz e Amadora)

INSERT INTO products (category, sub_category, name, expiry_date, expiry_dates, dlc_type, observation, store_id) VALUES
('DLC Positiva', 'SOBREMESAS', 'Cob Maracujá', '2025-11-11T00:00:00Z', ARRAY['2025-11-11T00:00:00Z','2025-12-07T00:00:00Z']::timestamp[], 'Primária', '', '7df6b644-4830-489c-afd7-a4d81d5f7b86'),
('DLC NEGATIVA PROTEÍNAS', '', 'Carne Royal', '2026-01-10T00:00:00Z', ARRAY['2026-01-10T00:00:00Z','2026-01-14T00:00:00Z']::timestamp[], 'Primária', '', '700016e3-f251-4494-920d-c769c0e6c732'),
('DLC Positiva', 'BEBIDAS', 'Compal ML', '2026-09-01T00:00:00Z', ARRAY['2026-09-01T00:00:00Z']::timestamp[], 'Primária', '', '7df6b644-4830-489c-afd7-a4d81d5f7b86'),
('DLC NEGATIVA OUTRAS', '', 'Produto promo', '2025-12-01T00:00:00Z', ARRAY['2025-12-01T00:00:00Z']::timestamp[], 'Primária', '', '700016e3-f251-4494-920d-c769c0e6c732'),
('Outros', '', 'Lipton Stevia', '2025-12-01T00:00:00Z', ARRAY['2025-12-01T00:00:00Z']::timestamp[], 'Secundária', '', '700016e3-f251-4494-920d-c769c0e6c732');

-- NOTA: Este é apenas um exemplo com os primeiros 5 produtos
-- O arquivo CSV completo tem mais de 300 produtos
-- Para importar todos, use o método do Supabase Dashboard (Table Editor > Insert rows)
-- ou me avise se quer que eu gere o script SQL completo com todos os 300+ produtos
