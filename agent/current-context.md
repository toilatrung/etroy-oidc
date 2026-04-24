# eTroy OIDC - Current Context

## I. Purpose

This file captures the current operational state of the project for fast session continuity.
It summarizes approved state and next actions without redefining architecture.

## II. Current Project State

- Documentation authority model is active: `docs/` is authoritative, `agent/` is support only.
- Most recently completed delivery: Phase 04 / Sprint 08 OIDC provider foundation and `/authorize` endpoint on `feature/oidc-sprint08-authorize-foundation`.
- `/authorize` is wired and validates authorization request shape, PKCE (`S256`), `client_id`, and exact-match `redirect_uri`.
- OIDC client validation is config-backed through `OIDC_CLIENTS_JSON`; Sprint 08 output stops at validated authorize request context only.
- Repository formatting is normalized and `format:check` passes, but the branch contains a large formatting-only diff caused by prior repository drift.

## III. Active Source of Truth

Authoritative layer: `docs/`
Operational support layer: `agent/` (non-authoritative)

Primary references:

- `docs/source-of-truth-index.md`
- `docs/README.md`
- architecture contracts
- requirements contract
- planning controls
- governance controls
- `docs/planning/assignments/phase-04-sprint-08.md`
- `docs/planning/reports/phase-04-sprint-08-report.md`

## IV. Current Phase and Sprint

- Current phase: Phase 04 - OIDC Core
- Current sprint: Sprint 08 - Provider Foundation + Authorization Endpoint
- Sprint status: COMPLETE
- Completion breakdown:
  - Implementation: COMPLETE
  - Validation: COMPLETE
  - Handoff: COMPLETE (Sprint 09 identified as next delivery step)

## V. Verified Baseline (2026-04-24)

- Config contract is active and flat in `src/config/`: `schema.ts`, `env.ts`, `config.ts`.
- Sprint 08 implementation baseline:
  - `src/modules/oidc/oidc.provider.ts` provides provider/config factory surface only.
  - `src/modules/oidc/oidc.service.ts` validates authorize requests and exposes non-executed `AuthBridge` contract surface.
  - `src/modules/oidc/oidc.controller.ts` and `src/app/server.ts` expose `GET /authorize`.
  - `.env.example`, `src/config/schema.ts`, and `src/config/config.ts` support `OIDC_CLIENTS_JSON`.
- Latest Sprint 08 validation:
  - `npm.cmd run lint`
  - `npm.cmd run typecheck`
  - `npm.cmd run format:check`
  - `npm.cmd run build`
  - boundary checks:
    - no `process.env` outside config
    - no token/session logic in `oidc`
    - no DB access from `oidc`
  - runtime checks:
    - valid authorize request -> PASS
    - invalid PKCE -> PASS
    - invalid client -> PASS
    - invalid redirect URI -> PASS
- Result summary:
  - `lint`: PASS
  - `typecheck`: PASS
  - `format:check`: PASS
  - `build`: PASS

## VI. PR / Branch Traceability (Verified)

- Sprint 08 implementation branch recorded in the report: `feature/oidc-sprint08-authorize-foundation`.
- Review and PR packaging should distinguish functional OIDC changes from repository-wide formatting normalization caused by prior drift.
- Sprint 08 boundary state to preserve in review:
  - `oidc-provider` is not mounted as callback middleware
  - `AuthBridge` exists as contract surface only and is not executed
  - no token, code-issuance, session, or direct DB logic is present in `oidc`

## VII. Immediate Next Actions

1. Prepare or open Sprint 08 PR from `feature/oidc-sprint08-authorize-foundation` with explicit boundary notes and validation evidence.
2. Start Sprint 09 contract and implementation planning for `/token` endpoint and authorization code exchange.
3. Preserve Phase 04 boundaries: no auth token generation, no direct DB access from `oidc`, no lifecycle/session leakage.
4. Restore or create `docs/planning/phases/phase-04-oidc-core.md` if it remains an expected source-of-truth document.

## VIII. Notes for Next Session

- Do not let `agent/` context override `docs/` contracts.
- `source-tree.md` remains the primary repository structure contract.
- Sprint 08 non-regression rules to preserve:
  - keep `/authorize` limited to request validation and boundary-safe delegation prep
  - enforce PKCE `S256`
  - keep exact-match `redirect_uri` validation
  - do not mount `oidc-provider` request handling or execute `AuthBridge` before approved continuation scope
- `docs/planning/phases/phase-04-oidc-core.md` is referenced by Sprint 08 docs but not present in the current workspace state.
