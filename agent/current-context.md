# eTroy OIDC - Current Context

## I. Purpose

This file captures the current operational state of the project for fast session continuity.
It summarizes approved state and next actions without redefining architecture.

## II. Current Project State

- Documentation authority model is active: `docs/` is authoritative, `agent/` is support only.
- Sprint 09 implementation was completed on branch `feature/oidc-sprint09-token-exchange` with:
  - `POST /authorize/continue`
  - `POST /token`
  - OIDC-owned authorization code issuance/persistence/validation/consume-on-success
  - PKCE verifier enforcement (`S256`)
  - client and strict `redirect_uri` validation
  - baseline access token provider abstraction (format-neutral, non-final)
- Sprint 09 working changes were temporarily stashed as:
  - `stash@{0}: On feature/oidc-sprint09-token-exchange: wip-sprint09-before-format`
- Current active branch is `chore/format-baseline-fix`, used for repository-wide formatting normalization.

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
- `docs/planning/assignments/phase-04-sprint-09.md`
- `docs/planning/reports/phase-04-sprint-08-report.md`
- `docs/planning/reports/phase-04-sprint-09-report.md`

## IV. Current Phase and Sprint

- Current phase: Phase 04 - OIDC Core
- Current sprint: Sprint 09 - Token Endpoint + Authorization Code Exchange
- Sprint status: IMPLEMENTED (report prepared), awaiting clean PR packaging workflow
- Completion breakdown:
  - Implementation: COMPLETE
  - Validation: COMPLETE (format issue later handled by dedicated formatting branch)
  - Handoff: IN PROGRESS (Sprint 10 prep)

## V. Verified Baseline (2026-04-24)

- Sprint 09 implementation artifacts (feature branch state):
  - OIDC service/controller and app routing updated for `/authorize/continue` and `/token`.
  - Added `authorization-code.model.ts` and `authorization-code.repository.ts` under `src/modules/oidc`.
  - Added format-neutral access token abstraction:
    - `src/modules/oidc/oidc.types.ts`
    - `src/modules/oidc/access-token.provider.ts`
- Sprint 09 validation summary:
  - `npm.cmd run lint`: PASS
  - `npm.cmd run typecheck`: PASS
  - `npm.cmd run build`: PASS
  - boundary grep checks: PASS
  - runtime exchange scenarios: PASS
  - `npm.cmd run format:check`: FAIL at that time due pre-existing repository-wide formatting drift
- Format baseline branch validation summary:
  - `npm.cmd run format`: PASS
  - `npx eslint "src/**/*.ts" --fix`: PASS
  - `npm.cmd run format:check`: PASS
  - `npm.cmd run lint`: PASS
- Mandatory boundary/neutrality status for Sprint 09 implementation:
  - no user persistence access from `oidc`: PASS
  - no `token-lifecycle` reuse in `oidc`: PASS
  - no JWT/signing/RSA/JWK/claims/id_token logic in access-token path: PASS

## VI. PR / Branch Traceability (Verified)

- Sprint 09 implementation branch: `feature/oidc-sprint09-token-exchange`
- Sprint 09 temporary stash snapshot: `stash@{0}` (`wip-sprint09-before-format`)
- Format-only branch: `chore/format-baseline-fix`
- Required PR split remains:
  1. format-only PR from `chore/format-baseline-fix`
  2. Sprint 09 feature PR from `feature/oidc-sprint09-token-exchange`

## VII. Immediate Next Actions

1. On `feature/oidc-sprint09-token-exchange`, re-apply `stash@{0}` and verify expected Sprint 09 diff.
2. Commit and open format-only PR from `chore/format-baseline-fix`.
3. Commit and open Sprint 09 PR with report `docs/planning/reports/phase-04-sprint-09-report.md`.
4. Preserve Sprint 09 boundaries in review: no ID token/claims/userinfo/refresh/session/lifecycle hardening.

## VIII. Notes for Next Session

- Do not let `agent/` context override `docs/` contracts.
- Keep formatting and Sprint 09 functional changes in separate PRs.
- Sprint 09 output is a baseline token system only and is NOT production lifecycle complete.
- Sprint 10 scope remains:
  - ID Token
  - claims mapping
  - `/userinfo`
- Phase 05 remains owner of refresh/rotation/revoke/session/SSO lifecycle hardening.
