# PipeFlow CRM — Migrations

## Como aplicar

### Opção A — Supabase SQL Editor (mais rápido)
1. Acesse [Supabase Studio](https://supabase.com/dashboard/project/nrqrhupltkumfmizsebs/editor)
2. Cole e execute cada arquivo na ordem:
   - `20260424000001_initial_schema.sql`
   - `20260424000002_rls_policies.sql`
   - `20260424000003_indexes.sql`

### Opção B — Supabase CLI
```bash
# 1. Autenticar (abre browser)
npx supabase login

# 2. Linkar ao projeto remoto
npx supabase link --project-ref nrqrhupltkumfmizsebs

# 3. Aplicar todas as migrations pendentes
npx supabase db push
```

---

## Modelo de Dados

```
auth.users (Supabase Auth — gerenciado pelo Supabase)
    │
    ├─── workspace_members ───── workspaces
    │         role                  plan
    │                               slug
    │
    ├─── leads ──────────────── workspace_id
    │         status                owner_id → auth.users
    │
    ├─── deals ──────────────── workspace_id
    │         stage                 lead_id → leads
    │         value                 owner_id → auth.users
    │
    ├─── activities ─────────── workspace_id
    │         type                  lead_id → leads
    │                               user_id → auth.users
    │
    └─── invites ────────────── workspace_id
              token
              expires_at
```

## Tabelas

| Tabela | Propósito |
|---|---|
| `workspaces` | Empresa/organização. Contém plano (`free`/`pro`) e IDs do Stripe. |
| `workspace_members` | Relacionamento N:N entre usuários e workspaces, com papel (`admin`/`member`). |
| `leads` | Contato/prospecto com status de qualificação. |
| `deals` | Oportunidade de venda vinculada a um lead, posicionada em um estágio do pipeline. |
| `activities` | Registro imutável de interações (ligação, e-mail, reunião, nota). |
| `invites` | Convite por e-mail com token único, expira em 7 dias. |

## Lógica de RLS

A regra central é implementada em duas funções `security definer`:

- **`is_workspace_member(workspace_id)`** — retorna `true` se o usuário autenticado (`auth.uid()`) é membro do workspace.
- **`is_workspace_admin(workspace_id)`** — retorna `true` se o usuário é membro com `role = 'admin'`.

`security definer` evita recursão infinita: as funções acessam `workspace_members` com privilégios do dono, não do usuário que fez a query.

### Resumo das permissões

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `workspaces` | membro | autenticado | admin | admin |
| `workspace_members` | membro | admin ou self | admin | admin ou self |
| `leads` | membro | membro | membro | membro |
| `deals` | membro | membro | membro | membro |
| `activities` | membro | membro | — | autor ou admin |
| `invites` | membro / token público | admin | admin | admin |

## Regenerar tipos TypeScript

Após qualquer alteração de schema, execute:

```bash
npx supabase gen types typescript \
  --project-id nrqrhupltkumfmizsebs \
  > types/supabase.ts
```
