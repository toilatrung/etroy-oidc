# eTroy OIDC - Current Context

## I. Purpose

This file captures the current operational state of the project for fast session continuity.
It summarizes approved state and next actions without redefining architecture.

## II. Current Project State

- Documentation authority model is active: `docs/` is authoritative, `agent/` is support only.
- Remote baseline synchronized and verified against `origin/main` (`851a4ec`) on 2026-04-15.
- Phase 01 / Sprint 02 is closed.
- Phase 01 / Sprint 03 is completed and Phase 01 is closed (Environment and Infrastructure Foundation):
  - Task 09: centralized MongoDB connection singleton with fail-fast behavior
  - Task 10: centralized Redis client singleton with fail-fast behavior
  - Task 11: structured logger baseline (`pino`) with config-driven log level
  - Task 12: RSA key loading, JWKS generation, and hash/verify infrastructure utilities
  - Task 13: interface-based swappable mail abstraction with placeholder provider
  - Task 14: lightweight metrics hooks and reusable base error surface
- Phase 02 / Sprint 04 is the active next execution target:
  - `users` module baseline
  - identity persistence and ownership
  - email uniqueness
  - profile update
  - controlled password change

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
- `docs/planning/phases/phase-02-identity-core.md`
- `docs/planning/assignments/phase-02-sprint-04.md`

## IV. Current Phase and Sprint

- Current phase: Phase 02 - Identity Core
- Current sprint: Sprint 04 - User Module
- Sprint 02: CLOSED
- Sprint 03: CLOSED - Infrastructure Layer
- Phase 01: CLOSED

## V. Verified Baseline (2026-04-20)

- Config contract is active and flat in `src/config/`: `schema.ts`, `env.ts`, `config.ts`.
- Sprint 03 infrastructure files for Tasks 09-14 are present in `src/infrastructure/*` and `src/shared/errors/*`.
- Logger dependency baseline includes `pino` in package manifests.
- No direct `process.env` usage was found outside `src/config/`.
- Final Sprint 03 validation chain passed:
  - `npm.cmd run lint`
  - `npm.cmd run typecheck`
  - `npm.cmd run build`
  - `rg -n "process\\.env" src --glob "!src/config/**"` -> no matches
  - `rg -n "console\\.log" src` -> no matches

## VI. PR / Branch Traceability (Verified)

- PR #4 `Feature/config sprint02 distribution`: closed, merged.
- PR #5 `chore: remove test layer (vitest + test script)`: closed, merged.
- PR #6 `fix(ci): clean workflow test references and fix formatting baseline`: closed, merged.
- PR #7 `fix(ci): remove unit-test and integration-test jobs from quality gate`: closed, merged.

## VII. Immediate Next Actions

1. Execute Sprint 04 from `docs/planning/assignments/phase-02-sprint-04.md`.
2. Implement `users` module only within approved ownership boundaries.
3. Maintain Phase 01 runtime/config/infrastructure boundaries during Phase 02 work.
4. Do not introduce `auth`, verification, password reset, token, session, or OIDC flow logic during Sprint 04 unless explicitly approved by source-of-truth updates.

## VIII. Notes for Next Session

- Do not let `agent/` context override `docs/` contracts.
- `source-tree.md` remains the primary repository structure contract.
- Keep infrastructure adapters free of business workflow logic.
- Keep shared error primitives generic/cross-cutting and module-agnostic.
- Phase 02 starts with `users`; `auth` belongs to Sprint 05.
