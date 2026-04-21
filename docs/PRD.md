# PROJECT ARCHITECTURE: PipeFlow CRM

## 1. CONTEXT & PROBLEM

Pequenas e médias empresas, freelancers e times de vendas perdem oportunidades de negócio por falta de organização no processo comercial. Leads são gerenciados em planilhas, anotações soltas ou ferramentas genéricas que não oferecem visão clara do funil de vendas. Não há registro centralizado de interações com clientes, e quando a equipe cresce, os dados ficam espalhados sem controle de acesso por empresa/time. Soluções como HubSpot e Pipedrive existem, mas são caras ou complexas demais para quem está começando.

## 2. PROPOSED SOLUTION

Construir o PipeFlow CRM — uma plataforma web SaaS de gestão de clientes e vendas, multiempresa, com pipeline visual Kanban, gestão completa de leads e negócios, registro de interações e integração de pagamento para monetização. A solução incluirá:

- CRM completo com cadastro de leads/contatos (nome, e-mail, telefone, empresa, cargo)
- Pipeline Kanban de vendas com arrastar e soltar entre etapas (Novo Lead → Contato → Proposta → Negociação → Fechado Ganho/Perdido)
- Página de detalhe do lead com histórico completo de atividades (ligações, e-mails, reuniões, notas)
- Sistema multi-empresa: cada espaço de trabalho isolado, com convite de colaboradores por e-mail
- Dashboard com métricas de vendas: total de leads, negócios abertos, valor do pipeline, taxa de conversão, gráficos de funil
- Monetização via planos de assinatura: Gratuito (até 2 colaboradores, 50 leads) e Pro (ilimitado, R$ 49/mês)
- Landing page de apresentação do produto

## 3. FUNCTIONAL REQUIREMENTS

- Login e Autenticação
- Kanban
- Dashboards
- Multi usuário
- Multi empresa
- Permissões por usuário
- Parte premium (paga)
- Integrações (API)
- Onboarding do Usuário
- Busca e Filtros
- Landing Page

### Gestão de Leads e Contatos

- Cadastro completo: nome, e-mail, telefone, empresa, cargo, status
- Lista com busca e filtros (por status, responsável, data)
- Página de detalhe com perfil completo e timeline de atividades

### Pipeline Kanban de Vendas

- Colunas por etapa: Novo Lead, Contato Realizado, Proposta Enviada, Negociação, Fechado Ganho, Fechado Perdido
- Cartões de negócios com título, valor estimado (R$), lead vinculado, responsável e prazo
- Arrastar e soltar entre etapas com persistência no banco

### Registro de Atividades

- Tipos: ligação, e-mail, reunião, nota
- Campos: autor, descrição, data
- Linha do tempo cronológica vinculada ao lead

### Painel de Métricas

- Cartões: total de leads, negócios abertos, valor total do pipeline, taxa de conversão
- Gráfico de funil de vendas (Recharts)
- Negócios do usuário logado com prazo próximo

### Multiempresa e Colaboração

- Criar espaços de trabalho (cada empresa/time = 1 espaço de trabalho)
- Convite de colaboradores por e-mail (com opção de Reenviar)
- Papéis: Admin (tudo) e Membro (leads e negócios)
- Alternar entre espaços de trabalho por meio do menu suspenso na barra lateral
- Isolamento de dados via Row Level Security (RLS) no Supabase

### Monetização (Stripe)

- Plano Grátis: até 2 colaboradores, 50 leads
- Plano Pro: colaboradores e leads ilimitados (R$ 49/mês)
- Checkout integrado via Stripe Checkout
- Webhook para ativar/desativar plano automaticamente (Supabase Edge Function)
- Portal do Cliente do Stripe para gerenciamento de assinatura

### Landing Page

- Página pública de apresentação do PipeFlow CRM
- Seções: hero, funcionalidades, planos/preços, CTA

## 4. USER PERSONAS

### Dono do Negócio / Empreendedor (Admin)
Pequeno empresário que precisa organizar seu processo de vendas. Cria o espaço de trabalho, convida o time, gerencia planos e tem acesso completo a todas as funcionalidades.

### Vendedor / Colaborador (Membro)
Profissional de vendas que usa o CRM no dia a dia. Cadastra leads, move negócios no pipeline, registra atividades. Pode participar de múltiplos espaços de trabalho.

### Freelancer / Consultor (Admin solo)
Profissional independente que atende vários clientes. Usa espaços de trabalho separados para cada cliente/projeto. Começa no plano Free e faz upgrade conforme cresce.

## 5. TECHNICAL STACK

- **Frontend**: Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + shadcn/ui
- **Backend/API**: Next.js API Routes (Server Components)
- **Banco de Dados + Autenticação**: Supabase (PostgreSQL + RLS + Auth)
- **Pagamentos**: Stripe (Checkout + Webhooks + Customer Portal)
- **E-mail transacional**: Resend
- **Arrastar e soltar**: @dnd-kit
- **Gráficos**: Recharts
- **Linguagem**: TypeScript 5
- **Deploy**: Vercel (frontend) + Supabase (backend/banco)
- **Versionamento**: Git + GitHub

## 6. DESIGN LANGUAGE

Referências: HubSpot CRM, Pipedrive, DataCrazy.

### HubSpot CRM
- CRM gratuito mais popular do mercado
- Pipeline visual, gestão de contatos, automações de marketing
- Pontos fortes: ecossistema completo, integrações abundantes
- Pontos fracos: complexo demais para PMEs, planos pagos muito caros (US$ 45–800/mês), curva de aprendizado alta
- Insight: simplificar a experiência focando apenas em vendas, sem automação de marketing

### Pipedrive
- CRM focado em vendas com pipeline visual excelente
- Pontos fortes: UX intuitivo, pipeline Kanban referência de mercado, foco em ação (orientado a atividades)
- Pontos fracos: sem plano gratuito (US$ 14–99/mês), funcionalidades avançadas travadas em planos caros
- Insight: nosso pipeline Kanban se inspira no Pipedrive, mas com modelo freemium acessível

## 7. PROCESS

- Break app build into logical milestones (steps)
- Each milestone should be a deliverable increment
- Prioritize core functionality first, then iterate
- Test each milestone before moving to the next
