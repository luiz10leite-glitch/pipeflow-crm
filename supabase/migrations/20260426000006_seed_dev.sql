-- Seed de desenvolvimento — dados de exemplo para a aula 3.4
-- Executar apenas em ambiente de desenvolvimento após criar um workspace real via UI.
--
-- Uso: substitua 'SEU_WORKSPACE_ID' e 'SEU_USER_ID' pelos valores reais do seu Supabase.
--      Você pode obter o workspace_id via: SELECT id FROM workspaces LIMIT 1;
--      E o user_id via: SELECT id FROM auth.users LIMIT 1;
--
-- Execute no SQL Editor do Supabase Dashboard.

DO $$
DECLARE
  v_workspace_id uuid;
  v_user_id      uuid;
  -- IDs fixos dos leads (para referenciar nos deals)
  l1  uuid := gen_random_uuid();
  l2  uuid := gen_random_uuid();
  l3  uuid := gen_random_uuid();
  l4  uuid := gen_random_uuid();
  l5  uuid := gen_random_uuid();
  l6  uuid := gen_random_uuid();
  l7  uuid := gen_random_uuid();
  l8  uuid := gen_random_uuid();
  l9  uuid := gen_random_uuid();
  l10 uuid := gen_random_uuid();
BEGIN
  -- Busca o primeiro workspace e usuário existentes
  SELECT id INTO v_workspace_id FROM workspaces LIMIT 1;
  SELECT id INTO v_user_id      FROM auth.users  LIMIT 1;

  IF v_workspace_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum workspace encontrado. Crie um workspace pelo app primeiro.';
  END IF;

  -- Limpa dados de exemplo anteriores (se houver) para rodar idempotente
  DELETE FROM activities WHERE workspace_id = v_workspace_id;
  DELETE FROM deals       WHERE workspace_id = v_workspace_id;
  DELETE FROM leads       WHERE workspace_id = v_workspace_id;

  -- ──────────────────────────────────────────────────────────────────────────
  -- LEADS
  -- ──────────────────────────────────────────────────────────────────────────
  INSERT INTO leads (id, workspace_id, owner_id, name, email, phone, company, job_title, status, created_at, updated_at) VALUES
    (l1,  v_workspace_id, v_user_id, 'Ana Claudia Ferreira',   'ana.ferreira@ferreiraadv.com.br',       '(11) 98765-4321', 'Ferreira Advocacia',            'Sócia',                'qualified',   NOW() - INTERVAL '46 days', NOW()),
    (l2,  v_workspace_id, v_user_id, 'Marcos Aurelio Oliveira','m.oliveira@grupooliveira.com.br',       '(21) 97654-3210', 'Grupo Oliveira Imóveis',        'Diretor Comercial',    'qualified',   NOW() - INTERVAL '48 days', NOW()),
    (l3,  v_workspace_id, v_user_id, 'Patricia Souza',         'patricia@souzaconsultoria.com.br',      '(31) 96543-2109', 'Souza & Irmãos Consultoria',    'Gerente',              'qualified',   NOW() - INTERVAL '57 days', NOW()),
    (l4,  v_workspace_id, v_user_id, 'Roberto Cardoso',        'roberto@techsolutionsbr.com.br',        '(11) 95432-1098', 'Tech Solutions Brasil',         'CEO',                  'converted',   NOW() - INTERVAL '70 days', NOW()),
    (l5,  v_workspace_id, v_user_id, 'Fernanda Lima',          'fernanda@limaarquitetura.com.br',       '(41) 94321-0987', 'Lima Arquitetura e Design',     'Arquiteta',            'new',         NOW() - INTERVAL '25 days', NOW()),
    (l6,  v_workspace_id, v_user_id, 'Diego Alves',            'diego.alves@alvesconstrutora.com.br',   '(85) 93210-9876', 'Alves Construtora',             'Engenheiro',           'contacted',   NOW() - INTERVAL '31 days', NOW()),
    (l7,  v_workspace_id, v_user_id, 'Camila Rocha',           'camila@rochaEventos.com.br',            '(71) 92109-8765', 'Rocha Eventos',                 'Produtora',            'qualified',   NOW() - INTERVAL '38 days', NOW()),
    (l8,  v_workspace_id, v_user_id, 'Thiago Nascimento',      'thiago@nascimentologistica.com.br',     '(62) 91098-7654', 'Nascimento Logística',          'Gerente de Operações', 'unqualified', NOW() - INTERVAL '75 days', NOW()),
    (l9,  v_workspace_id, v_user_id, 'Juliana Costa',          'ju.costa@costadigital.com.br',          '(51) 90987-6543', 'Costa Digital Marketing',       'Fundadora',            'new',         NOW() - INTERVAL '16 days', NOW()),
    (l10, v_workspace_id, v_user_id, 'Eduardo Martins',        'e.martins@martinsindustria.com.br',     '(11) 99876-5432', 'Martins Indústria',             'Diretor de Compras',   'qualified',   NOW() - INTERVAL '34 days', NOW());

  -- ──────────────────────────────────────────────────────────────────────────
  -- ACTIVITIES
  -- ──────────────────────────────────────────────────────────────────────────
  INSERT INTO activities (workspace_id, lead_id, user_id, type, description, created_at) VALUES
    (v_workspace_id, l1, v_user_id, 'call',    'Primeiro contato. Demonstrou interesse nos planos Pro.',                      NOW() - INTERVAL '45 days'),
    (v_workspace_id, l1, v_user_id, 'email',   'Enviado material de apresentação e proposta comercial.',                      NOW() - INTERVAL '44 days'),
    (v_workspace_id, l1, v_user_id, 'meeting', 'Reunião de alinhamento sobre funcionalidades necessárias para o escritório.', NOW() - INTERVAL '41 days'),
    (v_workspace_id, l2, v_user_id, 'call',    'Retornou contato após evento de networking.',                                 NOW() - INTERVAL '47 days'),
    (v_workspace_id, l2, v_user_id, 'meeting', 'Apresentação do produto para a equipe comercial. Boa receptividade.',        NOW() - INTERVAL '43 days'),
    (v_workspace_id, l2, v_user_id, 'email',   'Proposta formal enviada com preço customizado para 8 usuários.',             NOW() - INTERVAL '38 days'),
    (v_workspace_id, l3, v_user_id, 'email',   'Solicitou demonstração do painel de leads e pipeline.',                      NOW() - INTERVAL '55 days'),
    (v_workspace_id, l3, v_user_id, 'meeting', 'Demo ao vivo realizada. Pediu desconto para time de 10 usuários.',           NOW() - INTERVAL '51 days'),
    (v_workspace_id, l3, v_user_id, 'call',    'Negociando valores. Aguardando aprovação da diretoria.',                     NOW() - INTERVAL '36 days'),
    (v_workspace_id, l3, v_user_id, 'note',    'Decisão prevista para início de abril. Manter contato quinzenal.',           NOW() - INTERVAL '34 days'),
    (v_workspace_id, l4, v_user_id, 'call',    'Primeiro contato via indicação da Ana Ferreira.',                            NOW() - INTERVAL '69 days'),
    (v_workspace_id, l4, v_user_id, 'meeting', 'Apresentação completa. Interesse imediato no plano Pro anual.',              NOW() - INTERVAL '65 days'),
    (v_workspace_id, l4, v_user_id, 'email',   'Contrato assinado. Boas-vindas ao PipeFlow!',                                NOW() - INTERVAL '61 days'),
    (v_workspace_id, l6, v_user_id, 'email',   'Respondeu ao formulário de contato. Quer entender sobre o módulo pipeline.', NOW() - INTERVAL '30 days'),
    (v_workspace_id, l7, v_user_id, 'call',    'Qualificação BANT confirmada — budget, autoridade e prazo definidos.',       NOW() - INTERVAL '37 days'),
    (v_workspace_id, l7, v_user_id, 'note',    'Alto potencial. Empresa cresceu 30% no último ano.',                         NOW() - INTERVAL '36 days'),
    (v_workspace_id, l8, v_user_id, 'meeting', 'Demo realizada. Sem budget aprovado para este semestre.',                    NOW() - INTERVAL '70 days'),
    (v_workspace_id, l8, v_user_id, 'note',    'Revisitar no Q4 2026. Orçamento previsto para outubro.',                     NOW() - INTERVAL '69 days'),
    (v_workspace_id, l10, v_user_id,'call',    'Avaliando solução para substituir planilhas de controle de fornecedores.',   NOW() - INTERVAL '33 days'),
    (v_workspace_id, l10, v_user_id,'email',   'Proposta enviada incluindo integração via API com ERP atual.',               NOW() - INTERVAL '28 days');

  -- ──────────────────────────────────────────────────────────────────────────
  -- DEALS
  -- Stages do banco: lead | qualified | proposal | negotiation | closed_won | closed_lost
  -- ──────────────────────────────────────────────────────────────────────────
  INSERT INTO deals (workspace_id, owner_id, lead_id, title, value, stage, due_date, created_at, updated_at) VALUES
    -- lead (New Lead)
    (v_workspace_id, v_user_id, l1,   'Plano Pro — Ferreira Advocacia',       5880,  'lead',        NOW()::date + 14, NOW() - INTERVAL '11 days', NOW()),
    (v_workspace_id, v_user_id, l2,   'Licença Anual — Grupo Oliveira',       14112, 'lead',        NOW()::date + 24, NOW() - INTERVAL '10 days', NOW()),
    (v_workspace_id, v_user_id, l9,   'Onboarding Premium — Costa Digital',   2940,  'lead',        NULL,             NOW() - INTERVAL '8 days',  NOW()),
    -- qualified
    (v_workspace_id, v_user_id, l6,   'Demo → Proposta — Alves Construtora',  8820,  'qualified',   NOW()::date + 2,  NOW() - INTERVAL '16 days', NOW()),
    (v_workspace_id, v_user_id, l5,   'Plano Pro Mensal — Lima Arquitetura',  588,   'qualified',   NULL,             NOW() - INTERVAL '12 days', NOW()),
    (v_workspace_id, v_user_id, l9,   'Módulo Pipeline — Costa Digital',      3528,  'qualified',   NOW()::date - 1,  NOW() - INTERVAL '14 days', NOW()),
    -- proposal
    (v_workspace_id, v_user_id, l3,   'Proposta Customizada — Souza & Irmãos',17640, 'proposal',    NOW()::date,      NOW() - INTERVAL '21 days', NOW()),
    (v_workspace_id, v_user_id, l10,  'API Enterprise — Martins Indústria',   23520, 'proposal',    NOW()::date + 9,  NOW() - INTERVAL '18 days', NOW()),
    (v_workspace_id, v_user_id, l7,   'Plano Pro — Rocha Eventos',            7056,  'proposal',    NOW()::date + 6,  NOW() - INTERVAL '15 days', NOW()),
    -- negotiation
    (v_workspace_id, v_user_id, l2,   'Contrato Bianual — Grupo Oliveira',    47040, 'negotiation', NOW()::date - 2,  NOW() - INTERVAL '36 days', NOW()),
    (v_workspace_id, v_user_id, l3,   'Time 10 Usuários — Souza Consultoria', 29400, 'negotiation', NOW()::date + 4,  NOW() - INTERVAL '31 days', NOW()),
    (v_workspace_id, v_user_id, l7,   'Expansão — Rocha Eventos',             11760, 'negotiation', NOW()::date + 12, NOW() - INTERVAL '25 days', NOW()),
    -- closed_won
    (v_workspace_id, v_user_id, l4,   'Plano Pro Anual — Tech Solutions',     14112, 'closed_won',  NULL,             NOW() - INTERVAL '61 days', NOW()),
    (v_workspace_id, v_user_id, l4,   'Pro Anual — Santos Distribuidora',     12700, 'closed_won',  NULL,             NOW() - INTERVAL '66 days', NOW()),
    (v_workspace_id, v_user_id, l7,   'Starter Anual — Rocha Eventos',        5880,  'closed_won',  NULL,             NOW() - INTERVAL '41 days', NOW()),
    -- closed_lost
    (v_workspace_id, v_user_id, l8,   'Sem Budget Q1 — Nascimento Logística', 8820,  'closed_lost', NULL,             NOW() - INTERVAL '70 days', NOW()),
    (v_workspace_id, v_user_id, l6,   'Concorrente — Alves Construtora',      5880,  'closed_lost', NULL,             NOW() - INTERVAL '55 days', NOW());

  RAISE NOTICE 'Seed concluído: 10 leads, 20 atividades, 17 deals no workspace %', v_workspace_id;
END $$;
