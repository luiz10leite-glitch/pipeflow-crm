# PipeFlow CRM — Plano de Execução

Interface primeiro, backend depois. Cada milestone é um incremento funcional e navegável, com branch própria e commit final.

---

## Visão Geral dos Milestones

| # | Milestone | Branch | Foco |
|---|---|---|---|
| 1 | Setup & Fundação | `milestone/01-setup` | Scaffolding, design tokens, componentes base |
| 2 | Landing Page | `milestone/02-landing` | Página pública com hero, features, preços, CTA |
| 3 | Auth UI | `milestone/03-auth-ui` | Login, cadastro, forgot-password (telas estáticas) |
| 4 | App Shell | `milestone/04-app-shell` | Layout autenticado, sidebar, workspace switcher (mock) |
| 5 | Leads UI | `milestone/05-leads-ui` | Lista, filtros, detalhe, timeline de atividades (mock) |
| 6 | Pipeline UI | `milestone/06-pipeline-ui` | Kanban drag-and-drop com dados mockados |
| 7 | Dashboard UI | `milestone/07-dashboard-ui` | Métricas, gráfico de funil, tabela de deals próximos |
| 8 | Settings UI | `milestone/08-settings-ui` | Workspace, membros, billing (telas estáticas) |
| 9 | Banco de Dados | `milestone/09-database` | Schema Supabase, migrations, RLS, tipos TypeScript |
| 10 | Auth Backend | `milestone/10-auth-backend` | Supabase Auth integrado, sessão real, middleware |
| 11 | Leads Backend | `milestone/11-leads-backend` | CRUD real de leads e atividades conectado à UI |
| 12 | Pipeline Backend | `milestone/12-pipeline-backend` | CRUD de deals, persistência do drag-and-drop |
| 13 | Dashboard Backend | `milestone/13-dashboard-backend` | Queries reais de métricas e gráfico de funil |
| 14 | Multiempresa | `milestone/14-multiempresa` | Workspaces, convites por e-mail (Resend), papéis |
| 15 | Monetização | `milestone/15-monetizacao` | Stripe Checkout, webhooks, Customer Portal, limites |
| 16 | Onboarding | `milestone/16-onboarding` | Fluxo de boas-vindas pós-cadastro |
| 17 | Deploy | `milestone/17-deploy` | Vercel + Supabase prod, variáveis de ambiente, CI |

---

## M1 — Setup & Fundação

**Branch:** `milestone/01-setup`
**Objetivo:** Projeto configurado, design system operacional, componentes shadcn instalados.

- [x] Inicializar Next.js 15 com TypeScript strict (`npx create-next-app@latest`)
- [x] Configurar Tailwind CSS v4 e design tokens (cores brand, success, danger, neutral)
- [x] Instalar e configurar shadcn/ui (`npx shadcn@latest init`)
- [x] Adicionar componentes shadcn base: Button, Input, Card, Badge, Dialog, Sheet, Dropdown, Avatar, Separator, Tabs, Tooltip
- [x] Instalar dependências: `@dnd-kit/core @dnd-kit/sortable recharts lucide-react`
- [x] Criar estrutura de pastas conforme CLAUDE.md (`app/`, `components/`, `lib/`, `hooks/`, `types/`)
- [x] Configurar `lib/utils.ts` com `cn()` helper
- [x] Configurar ESLint + Prettier
- [x] Criar `.env.local.example` com todas as variáveis necessárias
- [x] Confirmar `npm run dev` e `npm run build` sem erros

**Commit final:** `feat: project setup — Next.js 16, Tailwind v4, shadcn/ui, folder structure`

---

## M2 — Landing Page

**Branch:** `milestone/02-landing`
**Objetivo:** Página pública `/` completa e responsiva, pronta para apresentar o produto.

- [ ] Criar `app/(marketing)/page.tsx` com layout público
- [ ] Seção **Hero**: headline, subheadline, CTA "Começar grátis" e "Ver demo"
- [ ] Seção **Features**: 6 cards com ícone, título e descrição (Pipeline Kanban, Multiempresa, Dashboard, Atividades, Plano Free, Segurança)
- [ ] Seção **Pricing**: 2 cards (Free e Pro R$ 49/mês) com lista de benefícios e botão de upgrade
- [ ] Seção **CTA final**: banner com chamada de ação + botão
- [ ] Header público com logo + links de navegação + botão Login
- [ ] Footer com links institucionais
- [ ] Responsivo: mobile, tablet e desktop
- [ ] Verificar Lighthouse score (Performance, Acessibilidade)

**Commit final:** `feat: landing page — hero, features, pricing, CTA, responsive`

---

## M3 — Auth UI

**Branch:** `milestone/03-auth-ui`
**Objetivo:** Telas de autenticação com layout consistente, sem lógica real ainda.

- [ ] Criar `app/(auth)/layout.tsx` com layout centrado (logo + card)
- [ ] Tela `/login`: campos e-mail e senha, botão "Entrar", link "Esqueci a senha", link "Cadastrar"
- [ ] Tela `/register`: campos nome, e-mail, senha e confirmação, botão "Criar conta", link "Já tenho conta"
- [ ] Tela `/forgot-password`: campo e-mail, botão "Enviar instruções", mensagem de sucesso
- [ ] Estados visuais: loading no botão, erro inline nos campos, sucesso
- [ ] Validação de formulários com `react-hook-form` + `zod`

**Commit final:** `feat: auth UI — login, register, forgot-password screens with form validation`

---

## M4 — App Shell

**Branch:** `milestone/04-app-shell`
**Objetivo:** Layout do app autenticado navegável com dados mockados.

- [x] Criar `app/(app)/layout.tsx` com sidebar fixa + área de conteúdo
- [x] Componente `Sidebar` com navegação: Dashboard, Leads, Pipeline, Configurações
- [x] Componente `WorkspaceSwitcher` no topo da sidebar (workspaces mockados)
- [x] Componente `UserMenu` com avatar, nome e opção de logout
- [x] Header com breadcrumb e nome da página atual
- [x] Rota `/dashboard` como página inicial do app (placeholder)
- [x] Middleware de proteção de rota (redireciona `/` → `/dashboard` se autenticado, `/(app)/*` → `/login` se não)
- [x] Responsivo: sidebar colapsável em mobile (Sheet do shadcn)

**Commit final:** `feat: app shell — sidebar, workspace switcher, user menu, route protection`

---

## M5 — Leads UI

**Branch:** `milestone/05-leads-ui`
**Objetivo:** Módulo de leads completo com dados mockados, navegável end-to-end.

- [ ] Página `/leads`: tabela com colunas (Nome, Empresa, Status, Responsável, Data)
- [ ] Componente `LeadCard` para visualização em grid (alternativa à tabela)
- [ ] Barra de busca por nome/empresa
- [ ] Filtros: status, responsável, período
- [ ] Botão "Novo Lead" → `LeadForm` em Dialog (campos: nome, e-mail, telefone, empresa, cargo, status)
- [ ] Ação de editar lead (mesmo form em modo edição)
- [ ] Ação de deletar lead com confirmação
- [ ] Página `/leads/[id]`: perfil completo do lead (header com dados + tabs)
- [ ] Tab **Visão Geral**: dados do lead em cards
- [ ] Tab **Atividades**: timeline cronológica com `ActivityTimeline`
- [ ] Componente `ActivityTimeline`: lista de atividades com ícone por tipo (ligação, e-mail, reunião, nota)
- [ ] Formulário inline para registrar nova atividade (tipo, descrição)
- [ ] Dados mockados via `lib/mock-data.ts`

**Commit final:** `feat: leads UI — list, filters, lead form, detail page, activity timeline (mock data)`

---

## M6 — Pipeline UI

**Branch:** `milestone/06-pipeline-ui`
**Objetivo:** Kanban funcional com drag-and-drop, dados mockados.

- [ ] Página `/pipeline` com `KanbanBoard`
- [ ] Componente `KanbanBoard`: container com `DndContext` do @dnd-kit
- [ ] Componente `KanbanColumn`: coluna por estágio com header (nome + contagem + valor total)
- [ ] Componente `DealCard`: cartão com título, valor (R$), lead vinculado, responsável (avatar), prazo e badge de urgência
- [ ] Drag-and-drop funcional entre colunas (somente visual, sem persistência ainda)
- [ ] Botão "Novo Deal" em cada coluna → `DealForm` em Dialog (título, valor, lead, responsável, prazo)
- [ ] Clicar no `DealCard` abre Sheet lateral com detalhe do deal
- [ ] Os 6 estágios do pipeline presentes e ordenados
- [ ] Scroll horizontal quando colunas excedem a tela

**Commit final:** `feat: pipeline UI — kanban board, drag-and-drop, deal card, deal form (mock data)`

---

## M7 — Dashboard UI

**Branch:** `milestone/07-dashboard-ui`
**Objetivo:** Painel de métricas com componentes de dados mockados.

- [ ] Página `/dashboard` com grid de cards e gráficos
- [ ] Componente `MetricCard`: ícone, label, valor e variação percentual (ex: +12% vs mês anterior)
- [ ] 4 cards: Total de Leads, Deals Abertos, Valor do Pipeline (R$), Taxa de Conversão (%)
- [ ] Componente `FunnelChart` com Recharts: barras horizontais por estágio do pipeline
- [ ] Tabela `DealsTable`: deals com prazo próximo (próximos 7 dias) com colunas título, lead, valor, prazo
- [ ] Layout responsivo: 2 colunas em desktop, 1 em mobile

**Commit final:** `feat: dashboard UI — metric cards, funnel chart, upcoming deals table (mock data)`

---

## M8 — Settings UI

**Branch:** `milestone/08-settings-ui`
**Objetivo:** Telas de configurações estáticas navegáveis.

- [ ] Layout `/settings` com tabs laterais (Workspace, Membros, Billing)
- [ ] Tab **Workspace**: nome, slug, logo upload (placeholder), botão salvar
- [ ] Tab **Membros**: tabela com membros (avatar, nome, e-mail, papel, status), botão "Convidar membro" → modal com campo e-mail
- [ ] Tab **Membros**: ação de reenviar convite e remover membro com confirmação
- [ ] Tab **Billing**: card do plano atual (Free/Pro), botão "Fazer upgrade" (Free) ou "Gerenciar assinatura" (Pro)
- [ ] Tab **Billing**: lista de benefícios do plano Pro com comparação

**Commit final:** `feat: settings UI — workspace, members, billing tabs (static)`

---

## M9 — Banco de Dados

**Branch:** `milestone/09-database`
**Objetivo:** Schema Supabase completo com RLS e tipos TypeScript gerados.

- [ ] Criar projeto Supabase (local via CLI + remoto)
- [ ] Migration `001_initial_schema`: tabelas `workspaces`, `workspace_members`, `leads`, `deals`, `activities`, `invites`
- [ ] Adicionar campos: `created_at`, `updated_at` em todas as tabelas
- [ ] Migration `002_rls_policies`: habilitar RLS em todas as tabelas + políticas por `workspace_id`
- [ ] Política: usuário só acessa dados do workspace onde é membro
- [ ] Migration `003_indexes`: índices em `workspace_id`, `lead_id`, `owner_id`, `stage`
- [ ] Gerar tipos TypeScript com `supabase gen types typescript` → `types/database.ts`
- [ ] Configurar `lib/supabase/server.ts` e `lib/supabase/client.ts`
- [ ] Testar políticas RLS manualmente no Supabase Studio
- [ ] Documentar modelo de dados em `supabase/migrations/README.md`

**Commit final:** `feat: database schema — migrations, RLS policies, indexes, TypeScript types`

---

## M10 — Auth Backend

**Branch:** `milestone/10-auth-backend`
**Objetivo:** Autenticação real com Supabase Auth, sessão persistida, middleware funcional.

- [ ] Integrar Supabase Auth nos formulários de login e cadastro (M3)
- [ ] Cadastro: criar usuário + criar workspace padrão + adicionar como admin
- [ ] Login: autenticar e redirecionar para `/dashboard`
- [ ] Logout: limpar sessão e redirecionar para `/login`
- [ ] Forgot password: enviar e-mail de reset via Supabase Auth
- [ ] Middleware `middleware.ts`: verificar sessão ativa; proteger rotas `/(app)/*`
- [ ] `lib/supabase/server.ts` com `createServerClient` para Server Components e Route Handlers
- [ ] Hook `useUser()` para Client Components acessarem o usuário logado
- [ ] Remover dados mockados de autenticação

**Commit final:** `feat: auth backend — Supabase Auth integrated, session, middleware, workspace creation`

---

## M11 — Leads Backend

**Branch:** `milestone/11-leads-backend`
**Objetivo:** CRUD real de leads e atividades substituindo todos os mocks.

- [ ] Server Action ou Route Handler: `createLead`, `updateLead`, `deleteLead`
- [ ] Server Action: `createActivity`
- [ ] Página `/leads` carrega leads reais do workspace atual (Server Component)
- [ ] Busca e filtros com query params persistidos na URL (`?search=&status=&owner=`)
- [ ] Página `/leads/[id]` carrega lead real + atividades ordenadas por `created_at DESC`
- [ ] Formulários de lead e atividade submetendo para as actions reais
- [ ] Validação Zod nas actions (server-side)
- [ ] Feedback de sucesso/erro com toast (`sonner`)
- [ ] Remover `lib/mock-data.ts` (leads)

**Commit final:** `feat: leads backend — real CRUD, activities, search, filters connected to Supabase`

---

## M12 — Pipeline Backend

**Branch:** `milestone/12-pipeline-backend`
**Objetivo:** Deals persistidos no banco, drag-and-drop com atualização real de estágio.

- [ ] Server Action: `createDeal`, `updateDeal`, `deleteDeal`, `updateDealStage`
- [ ] Página `/pipeline` carrega deals reais agrupados por estágio (Server Component)
- [ ] Drag-and-drop chama `updateDealStage` ao soltar card em nova coluna
- [ ] Optimistic update no cliente para UX fluida (sem esperar resposta do servidor)
- [ ] Sheet de detalhe do deal com dados reais
- [ ] Formulário de deal conectado a lead real (select com busca de leads do workspace)
- [ ] Remover mocks de deals

**Commit final:** `feat: pipeline backend — real deals CRUD, drag-and-drop persistence, optimistic updates`

---

## M13 — Dashboard Backend

**Branch:** `milestone/13-dashboard-backend`
**Objetivo:** Métricas e gráfico calculados com queries reais.

- [ ] Query: total de leads do workspace
- [ ] Query: deals abertos (excluindo Fechado Ganho/Perdido)
- [ ] Query: soma do valor dos deals abertos (valor do pipeline)
- [ ] Query: taxa de conversão = Fechado Ganho / (Fechado Ganho + Fechado Perdido)
- [ ] Query: contagem de leads por estágio para o `FunnelChart`
- [ ] Query: deals com `due_date` nos próximos 7 dias para `DealsTable`
- [ ] Todas as queries em Server Components (sem useEffect)
- [ ] Remover mocks do dashboard

**Commit final:** `feat: dashboard backend — real metrics, funnel data, upcoming deals from Supabase`

---

## M14 — Multiempresa

**Branch:** `milestone/14-multiempresa`
**Objetivo:** Múltiplos workspaces funcionais, convites por e-mail, papéis e permissões reais.

- [ ] Criar workspace: form na settings + Server Action `createWorkspace`
- [ ] `WorkspaceSwitcher` carrega workspaces reais do usuário e persiste a seleção (cookie ou URL)
- [ ] Middleware injeta `workspaceId` ativo no contexto de cada request
- [ ] Convidar membro: Server Action `inviteMember` → grava `invites` + envia e-mail via Resend
- [ ] Template de e-mail de convite (link com token único)
- [ ] Rota `/invites/[token]`: aceitar convite → adiciona usuário ao workspace como membro
- [ ] Reenviar convite: regenera token e reenvia e-mail
- [ ] Remover membro: Server Action `removeMember` com verificação de papel Admin
- [ ] Trocar papel de membro (admin ↔ membro): Server Action `updateMemberRole`
- [ ] Guards de plano: bloquear convite se Free e já há 2 membros; bloquear criação de lead se Free e já há 50 leads
- [ ] Mensagem de upgrade quando limite é atingido

**Commit final:** `feat: multiworkspace — create, switch, invite via email (Resend), roles, plan limits`

---

## M15 — Monetização

**Branch:** `milestone/15-monetizacao`
**Objetivo:** Fluxo completo de upgrade/downgrade via Stripe.

- [ ] Configurar produto e preço no Stripe (R$ 49/mês, BRL)
- [ ] `lib/stripe.ts` com cliente Stripe configurado
- [ ] Server Action `createCheckoutSession`: cria sessão Stripe Checkout e redireciona
- [ ] Rota `app/api/webhooks/stripe/route.ts`: processar eventos `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Webhook atualiza campo `plan` no workspace (`free` | `pro`) e `stripe_customer_id`, `stripe_subscription_id`
- [ ] Server Action `createBillingPortalSession`: abre Customer Portal do Stripe para gerenciar assinatura
- [ ] Botão "Fazer upgrade" na tab Billing chama `createCheckoutSession`
- [ ] Botão "Gerenciar assinatura" chama `createBillingPortalSession`
- [ ] Testar fluxo completo com Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
- [ ] Página de sucesso pós-checkout `/billing/success`

**Commit final:** `feat: monetization — Stripe Checkout, webhooks, Customer Portal, plan activation`

---

## M16 — Onboarding

**Branch:** `milestone/16-onboarding`
**Objetivo:** Fluxo de boas-vindas que guia o novo usuário até o primeiro lead criado.

- [ ] Detectar primeiro acesso (workspace sem leads)
- [ ] Página `/onboarding` com stepper de 3 passos:
  - Passo 1: Nome do workspace (pré-preenchido, editável)
  - Passo 2: Convidar colaboradores (opcional, pode pular)
  - Passo 3: Criar primeiro lead
- [ ] Ao concluir, redirecionar para `/pipeline`
- [ ] Marcar onboarding como completo no workspace (`onboarding_completed_at`)
- [ ] Usuários que já completaram o onboarding não veem mais a página

**Commit final:** `feat: onboarding — 3-step wizard, workspace naming, invite, first lead creation`

---

## M17 — Deploy

**Branch:** `milestone/17-deploy`
**Objetivo:** Aplicação em produção no Vercel + Supabase, estável e monitorável.

- [ ] Criar projeto no Vercel e linkar ao repositório GitHub
- [ ] Aplicar migrations no Supabase remoto de produção (`supabase db push`)
- [ ] Configurar todas as variáveis de ambiente no Vercel (via `vercel env add` ou dashboard)
- [ ] Configurar domínio personalizado no Vercel (se houver)
- [ ] Configurar webhook Stripe com URL de produção
- [ ] Configurar domínio de e-mail no Resend + template de convite com URL de produção
- [ ] Testar fluxo completo em produção: cadastro → onboarding → lead → pipeline → upgrade
- [ ] Configurar Vercel Analytics
- [ ] Adicionar `robots.txt` e `sitemap.xml` para a landing page
- [ ] Verificar HTTPS, headers de segurança (`X-Frame-Options`, `CSP`)
- [ ] `npm run build` sem erros ou warnings antes do merge final

**Commit final:** `feat: production deploy — Vercel, Supabase prod, Stripe prod, env vars, smoke test`

---

## Ordem de Dependências

```
M1 → M2, M3 (paralelo)
M3 → M4
M4 → M5, M6, M7, M8 (paralelo)
M5 + M6 + M7 + M8 → M9
M9 → M10
M10 → M11, M12, M13 (paralelo)
M11 + M12 + M13 → M14
M14 → M15
M15 → M16
M16 → M17
```

---

## Critério de Conclusão de cada Milestone

Antes de abrir PR e mesclar na `main`:
- [ ] `npm run build` passa sem erros
- [ ] `npm run lint` sem warnings
- [ ] Fluxo principal do milestone navegável manualmente
- [ ] Nenhum dado mockado residual (a partir do M10)
