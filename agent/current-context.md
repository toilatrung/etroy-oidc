# eTroy OIDC - Current Context

## I. Purpose

This file captures the current operational state of the project for fast session continuity.
It summarizes approved state and next actions without redefining architecture.

## II. Current Project State

- Documentation authority model is active: `docs/` is authoritative, `agent/` is support only.
- Current implementation focus: Phase 03 / Sprint 07 password-reset flow is implemented and validated.
- Repository formatting baseline cleanup was executed and `format:check` now passes.
- Final delivery strategy requires two separate PRs:
  - PR 1: formatting baseline cleanup only (`chore/format-baseline-fix`)
  - PR 2: Sprint 07 logic only (`feature/password-reset-sprint07-reset-flow`)

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
- `docs/planning/phases/phase-03-account-lifecycle.md`
- `docs/planning/assignments/phase-03-sprint-07.md`
- `docs/planning/reports/phase-03-sprint-07-report.md`

## IV. Current Phase and Sprint

- Current phase: Phase 03 - Account Lifecycle
- Current sprint: Sprint 07 - Password Reset Module
- Sprint status: COMPLETE (implementation and validation complete; PR split pending)
- Completion breakdown:
  - Implementation: COMPLETE
  - Validation: COMPLETE
  - PR packaging: IN PROGRESS (split into format-only PR and logic-only PR)

## V. Verified Baseline (2026-04-23)

- Config contract is active and flat in `src/config/`: `schema.ts`, `env.ts`, `config.ts`.
- Sprint 07 validation chain passed:
  - `npm.cmd run lint`
  - `npm.cmd run typecheck`
  - `npm.cmd run format:check`
  - `npm.cmd run build`
  - `rg -n "process\\.env" src --glob "!src/config/**"` -> no matches
  - `rg -n "jwt|JWT" src/modules/password-reset` -> no matches
  - `rg -n "session" src/modules/password-reset` -> no matches
  - `rg -n "OIDC|oidc" src/modules/password-reset` -> no matches
  - `rg -n "UserModel|user\\.repository|mongoose|findOne|findById|updateUser|create\\(" src/modules/password-reset` -> no matches
  - `rg -n "changePassword\\(|consumeToken\\(|validateToken\\(" src/modules/password-reset/password-reset.service.ts` -> expected flow calls found

## VI. PR / Branch Traceability (Verified)

- Formatting cleanup PR target branch: `chore/format-baseline-fix` (format-only changes).
- Sprint 07 PR target branch: `feature/password-reset-sprint07-reset-flow` (logic + Sprint 07 evidence updates only).
- Pre-existing unrelated docs edits must remain out of Sprint 07 PR unless directly required by Sprint 07 evidence.

## VII. Immediate Next Actions

1. Split current worktree into two PR-ready change sets by explicit file grouping.
2. Open PR 1 for formatting baseline cleanup only.
3. Open PR 2 for Sprint 07 implementation only with evidence-backed report artifacts.

## VIII. Notes for Next Session

- Do not let `agent/` context override `docs/` contracts.
- `source-tree.md` remains the primary repository structure contract.
- Sprint 07 non-regression rules to preserve:
  - exact success payload `{ "status": "success" }`
  - anti-enumeration behavior
  - strict post-success token consumption
  - `sub` identity reference through token-lifecycle
  - users-owned password mutation only
