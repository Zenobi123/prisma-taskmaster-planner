# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run lint         # ESLint
npx vitest           # Run all tests
npx vitest run src/utils/__tests__/factureUtils.test.ts  # Run a single test file
npx vitest run src/lib/spec/__tests__/fiscal.test.ts
```

Tests use **vitest** with `jsdom` environment. Path alias `@/` maps to `src/`.

## Architecture

**Stack**: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui + Supabase + React Query

This is a fiscal/accounting management SaaS (PRISMA GESTION) for a Cameroonian accounting firm, ported from a vanilla HTML/localStorage app to a React/Supabase app.

### Route → Page map

| Route | Page | Purpose |
|---|---|---|
| `/` | `Index.tsx` | Dashboard (KPIs, alerts, tasks) |
| `/clients` | `Clients.tsx` | Client CRUD with fiscal calculations |
| `/facturation` | `Facturation.tsx` | Invoices, quotes, payment proposals, receipts |
| `/gestion` | `Gestion.tsx` | Client fiscal situation (obligations, payments) |
| `/courrier` | `Courrier.tsx` | Letter drafting with 20+ predefined templates |
| `/missions` | `Missions.tsx` | Mission/task tracking |
| `/planning` | `Planning.tsx` | Calendar view for collaborators |
| `/collaborateurs` | `Collaborateurs.tsx` | Staff management |
| `/rapports` | `Rapports.tsx` | Reporting |
| `/parametres` | `Parametres.tsx` | Cabinet config (signature, stamp, signatory) |

Authentication is Supabase Auth; `App.tsx` wraps all routes in a `PrivateRoute` that redirects to `/login`.

### Key source directories

- `src/lib/spec/` — **Canonical business logic**: `fiscal.ts` (all tax computation), `fiscal-constants.ts` (IGS brackets, Patente rates, TDL brackets, etc.), `courrierStatut.ts` (courrier status labels/badges for the printable view), `pdfExport.ts`, `usePrint.ts`. Tests live in `src/lib/spec/__tests__/`.
- `src/config/fiscalConstants.ts` — Duplicate constants used by some older components; prefer `src/lib/spec/fiscal-constants.ts`.
- `src/services/` — Supabase data access layer (one file per domain: `clientService.ts`, `factureService.ts`, `devisService.ts`, `propositionService.ts`, `courrierService.ts`, etc.).
- `src/integrations/supabase/` — `client.ts` (typed Supabase client), `types.ts` (auto-generated DB types), `extraTables.ts` (manual type extensions for tables not in generated types).
- `src/hooks/fiscal/` — Hooks encapsulating fiscal obligation state and save flows (`useObligationsFiscales`, `useFiscalDataSave`, `useUnifiedFiscalSave`, etc.).
- `src/components/facturation/` — Invoice, quote, proposal and receipt UI components.
- `src/components/clients/` — Client list, form, import/export components.
- `src/utils/` — Pure utility functions (`fiscalCalculations.ts`, `numberToWords.ts`, `courrierTemplates.ts`, `exportUtils.ts`, PDF helpers).

### Data model highlights

Every transactional document (facture, devis, proposition, reçu, courrier) stores a `client_data` snapshot at emission time — **never re-fetch the live client for document rendering**.

Document numbering formats:
- Facture: `N° NNNN/YYYY/MM`
- Devis: `DEVIS-NNNN/YYYY/MM`
- Reçu: `RECU-NNNN/YYYY`
- Courrier: `CRR-NNNN/YYYY/MM`

Date storage for manual mode: always `new Date(val + 'T12:00:00').toISOString()` to avoid UTC day-shift.

### Fiscal computation rules (source of truth: `src/lib/spec/fiscal.ts`)

- **IGS** — 10-class bracket table (CA < 50 M F CFA). CGA members get 50% reduction; TDL is calculated on the *pre-reduction* IGS principal.
- **Patente** — 0.283% of CA, floored at 141 500, capped at 4 500 000 F CFA.
- **Solde IR/IS** — 0.1% of CA when CA ≥ 15 M F CFA. Label is "Solde IS" for legal entities (`type === 'Personne morale'`).
- **TDL** — Bracket table based on IGS principal amount.
- **PSL/Bail/TF** — Immovable property taxes; OBNL and NonPro clients are exempt from PSL and pay Bail at 5% instead of 10%.
- **Licence boissons** — 2× IGS (IGS regime) or 2× Patente (Réel regime).
- Penalties: 10% per month of delay on quarterly IGS instalments (T1=15 Jan, T2=15 Mar, T3=15 Jul, T4=15 Oct).

### Printing / PDF

Use `src/lib/spec/usePrint.ts` (`usePrint(ref)`) rather than `window.open`. The hook temporarily replaces `document.body.innerHTML`, calls `window.print()`, then restores. In Lovable/React context, `react-to-print` is the preferred alternative.

For PDF export: `html2canvas(el, { scale: 2, useCORS: true })` → split into A4 pages → jsPDF. File names use `sanitizePdfSegment()` to strip `N° `, slashes, and non-alphanumeric characters (accented letters are kept).

### Money formatting

Always `Math.round(amount || 0).toLocaleString('fr-FR') + ' F CFA'`. Never display raw floats.

### UI conventions

- Primary color: `#1e3a8a` (blue-900 / `--primary`)
- shadcn/ui components live in `src/components/ui/`
- Toast: `useToast()` (shadcn) or `sonner` — success=green, warning=amber, error=red, info=blue; default duration 3 s
- Confirmation dialogs for deletes use shadcn `<AlertDialog>`
- All pages are wrapped in `<PageLayout>` from `src/components/layout/PageLayout.tsx`
- Mobile detection via `useIsMobile()` hook

### Letter templates

`src/utils/courrierTemplates.ts` is the **single source** of letter templates (~21 templates in 5 categories: fiscal, relance, client, information, convocation). It drives the Courrier page (`Courrier.tsx`, `TemplateSelection`, `PreviewDialog`) and `courrierStorageService`. Placeholders use the `{{...}}` syntax (`{{nom}}`, `{{niu}}`, `{{centre}}`, `{{regime}}`, `{{secteur}}`, `{{annee}}`, `{{montant_igs}}`, `{{montant_patente}}`, `{{civilite}}`) and are substituted at render time. Civilité longue is always `Madame` / `Monsieur` (not `Mme.`/`M.`).

Courrier *status* metadata (labels/badges) for the printable view lives separately in `src/lib/spec/courrierStatut.ts`.

### Supabase notes

- `src/integrations/supabase/extraTables.ts` adds manual type definitions for tables (`facture_prestations`, etc.) missing from the auto-generated `types.ts`. Run `supabase gen types typescript` to regenerate `types.ts` when schema changes; once regenerated, `extraTables.ts` entries can be removed.
- React Query is configured with `staleTime: 5 min`, `gcTime: 30 min`, `retry: 1`, `refetchOnWindowFocus: false`.

### Development branch

All changes must go to branch `claude/brave-galileo-6Zuf5`.
