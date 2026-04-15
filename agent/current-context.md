# eTroy OIDC - Current Context

## I. Purpose

This file captures the current operational state of the project for fast session continuity.
It summarizes approved state and next actions without redefining architecture.

## II. Current Project State

- Documentation authority model is established and active.
- Phase 01 / Sprint 01 bootstrap baseline is complete and governance-closed.
- Phase 01 / Sprint 02 config baseline has been corrected to approved flat config contract.
- Governance anti-pattern reference has been synchronized with current source-of-truth contracts.

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

## IV. Current Phase and Sprint

- Current phase: Phase 01 - Environment and Infrastructure Foundation
- Current sprint focus: Sprint 02 - Config Distribution Standard
- Sprint 02 status: implementation complete, validation evidence captured locally

## V. Current Priorities

- preserve strict config boundary (`process.env` encapsulated in `src/config` only)
- enforce anti-pattern checks during review to prevent structural and boundary drift
- keep validation evidence aligned with Sprint 02 acceptance criteria
- maintain traceability in PR workflow

## VI. Recent Verified Findings

- Branch: `feature/config-sprint02-distribution`.
- `src/config` active contract is flat and approved: `schema.ts`, `env.ts`, `config.ts`.
- Runtime config validation is fail-fast with actionable errors.
- `docs/governance/anti-patterns.md` now defines merge-blocking drift patterns aligned with architecture and governance.
- Static checks passed: `lint`, `typecheck`, `format:check`.
- Runtime evidence captured:
  - valid config import succeeds
  - malformed env value causes immediate `ConfigValidationError`

## VII. Deferred or Pending Items

- integrate config import into broader app bootstrap once delivery layer wiring begins
- prepare Sprint 02 PR narrative and review package

## VIII. Immediate Next Actions

1. Keep all new runtime consumers on `src/config/config.ts` exported `config` surface.
2. Apply anti-pattern checklist in PR review alongside governance checklist.
3. Carry Sprint 02 output into PR template with evidence.

## IX. Notes for Next Session

- Scope lock remains Phase 01 / Sprint 02 / Tasks 05-08.
- Do not reintroduce direct `process.env` reads outside `src/config`.
- Keep documentation contracts synchronized if config structure changes again.

