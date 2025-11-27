-- ============================================
-- DADOS DE TESTE PARA O DASHBOARD
-- ============================================
-- Execute este script no Supabase SQL Editor

-- IMPORTANTE: Substitua 'SEU_STORE_ID_AQUI' pelo ID da sua loja
-- Para descobrir seu store_id, execute primeiro:
-- SELECT id, store_id FROM user_profiles WHERE id = auth.uid();

-- ============================================
-- VARIÁVEL: Defina seu store_id aqui
-- ============================================
DO $$
DECLARE
    v_store_id UUID;
    v_user_id UUID;
BEGIN
    -- Pega o store_id do usuário atual
    SELECT store_id, id INTO v_store_id, v_user_id 
    FROM user_profiles 
    WHERE id = auth.uid();

    -- Se não encontrou, para aqui
    IF v_store_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não tem store_id definido. Configure seu perfil primeiro.';
    END IF;

    RAISE NOTICE 'Usando store_id: % e user_id: %', v_store_id, v_user_id;

    -- ============================================
    -- 1. DADOS DE VENDAS (SALES)
    -- ============================================
    INSERT INTO sales (store_id, sale_date, platform, total_value, created_by) VALUES
    (v_store_id, '2025-01-15', 'Delivery', 7660.00, v_user_id),
    (v_store_id, '2025-01-15', 'Sala', 5200.00, v_user_id),
    (v_store_id, '2025-02-15', 'Delivery', 9310.00, v_user_id),
    (v_store_id, '2025-02-15', 'Sala', 6100.00, v_user_id),
    (v_store_id, '2025-03-15', 'Delivery', 10880.00, v_user_id),
    (v_store_id, '2025-03-15', 'Sala', 7200.00, v_user_id),
    (v_store_id, '2025-04-15', 'Delivery', 7250.00, v_user_id),
    (v_store_id, '2025-04-15', 'Sala', 4800.00, v_user_id),
    (v_store_id, '2025-05-15', 'Delivery', 19340.00, v_user_id),
    (v_store_id, '2025-05-15', 'Sala', 12500.00, v_user_id),
    (v_store_id, '2025-06-15', 'Delivery', 13540.00, v_user_id),
    (v_store_id, '2025-06-15', 'Sala', 9200.00, v_user_id),
    (v_store_id, '2025-07-15', 'Delivery', 14200.00, v_user_id),
    (v_store_id, '2025-07-15', 'Sala', 9800.00, v_user_id);

    -- ============================================
    -- 2. TEMPOS DE SERVIÇO (SERVICE_TIMES)
    -- ============================================
    INSERT INTO service_times (store_id, record_date, lunch_time, dinner_time, day_time, target_time, created_by) VALUES
    (v_store_id, '2025-01-15', 97, 105, 108, 110, v_user_id),
    (v_store_id, '2025-02-15', 99, 108, 112, 110, v_user_id),
    (v_store_id, '2025-03-15', 108, 115, 120, 110, v_user_id),
    (v_store_id, '2025-04-15', 117, 122, 125, 110, v_user_id),
    (v_store_id, '2025-05-15', 121, 128, 130, 110, v_user_id),
    (v_store_id, '2025-06-15', 128, 135, 138, 110, v_user_id),
    (v_store_id, '2025-07-15', 135, 140, 142, 110, v_user_id);

    -- ============================================
    -- 3. CUSTOS (COSTS)
    -- ============================================
    INSERT INTO costs (store_id, record_date, cost_type, percentage, target_percentage, created_by) VALUES
    -- Janeiro
    (v_store_id, '2025-01-15', 'comida', 26.78, 26.50, v_user_id),
    (v_store_id, '2025-01-15', 'papel', 1.52, 1.50, v_user_id),
    -- Fevereiro
    (v_store_id, '2025-02-15', 'comida', 27.12, 26.50, v_user_id),
    (v_store_id, '2025-02-15', 'papel', 1.68, 1.50, v_user_id),
    -- Março
    (v_store_id, '2025-03-15', 'comida', 26.95, 26.50, v_user_id),
    (v_store_id, '2025-03-15', 'papel', 1.45, 1.50, v_user_id),
    -- Abril
    (v_store_id, '2025-04-15', 'comida', 27.50, 26.50, v_user_id),
    (v_store_id, '2025-04-15', 'papel', 1.75, 1.50, v_user_id),
    -- Maio
    (v_store_id, '2025-05-15', 'comida', 26.20, 26.50, v_user_id),
    (v_store_id, '2025-05-15', 'papel', 1.38, 1.50, v_user_id),
    -- Junho
    (v_store_id, '2025-06-15', 'comida', 26.85, 26.50, v_user_id),
    (v_store_id, '2025-06-15', 'papel', 1.55, 1.50, v_user_id),
    -- Julho
    (v_store_id, '2025-07-15', 'comida', 27.10, 26.50, v_user_id),
    (v_store_id, '2025-07-15', 'papel', 1.62, 1.50, v_user_id);

    -- ============================================
    -- 4. DESVIOS DE INVENTÁRIO (INVENTORY_DEVIATIONS)
    -- ============================================
    INSERT INTO inventory_deviations (store_id, record_date, item_name, deviation_value, status, created_by) VALUES
    (v_store_id, '2025-07-15', 'Pão Reg', -114, 'critical', v_user_id),
    (v_store_id, '2025-07-15', 'Queijo Cheddar', 45, 'ok', v_user_id),
    (v_store_id, '2025-07-15', 'Alface', -78, 'warning', v_user_id),
    (v_store_id, '2025-07-15', 'Tomate', 32, 'ok', v_user_id),
    (v_store_id, '2025-07-15', 'Carne Bovina', -95, 'warning', v_user_id),
    (v_store_id, '2025-07-15', 'Batata Frita', 18, 'ok', v_user_id),
    (v_store_id, '2025-07-15', 'Coca-Cola', -125, 'critical', v_user_id),
    (v_store_id, '2025-07-15', 'Maionese', 28, 'ok', v_user_id);

    RAISE NOTICE 'Dados de teste inseridos com sucesso!';
    RAISE NOTICE 'Total de registros:';
    RAISE NOTICE '- Sales: 14 registros';
    RAISE NOTICE '- Service Times: 7 registros';
    RAISE NOTICE '- Costs: 14 registros';
    RAISE NOTICE '- Inventory Deviations: 8 registros';

END $$;

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute estas queries para verificar os dados inseridos:

-- SELECT COUNT(*) as total_sales FROM sales WHERE store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid());
-- SELECT COUNT(*) as total_service_times FROM service_times WHERE store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid());
-- SELECT COUNT(*) as total_costs FROM costs WHERE store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid());
-- SELECT COUNT(*) as total_deviations FROM inventory_deviations WHERE store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid());
