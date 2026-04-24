# eTroy OIDC - Current Context

## I. Purpose

This file captures the current operational state of the project for fast session continuity.
It summarizes approved state and next actions without redefining architecture.

## II. Current Project State

- Documentation authority model is active: `docs/` is authoritative, `agent/` is support only.
- Active phase: Phase 04 - OIDC Core.
- Sprint 09 status: completed.
- Sprint 10 JWT contract created: `docs/contracts/oidc/jwt-token-contract.md`.
- Sprint 10 status: NOT started.
- Sprint 10 blocker: Sprint 10 is blocked until JWT contract is approved.

## III. Access Token Alignment Decision (2026-04-24)

- Final access_token direction is JWT.
- JWT access_token implementation is LOCKED to Sprint 10.
- Sprint 09 MUST NOT implement JWT semantics.

Mandatory statement:

- Sprint 09 access_token is a baseline placeholder used only to validate the authorization-code exchange path. It is not a finalized OIDC client-usable access token. JWT access_token formalization is locked to Sprint 10 and must not be implemented before the Sprint 10 contract is approved.

Required Sprint 09 interpretation:

- token is baseline-only and non-final
- token has no claims contract
- token has no signing / RSA / JWK semantics
- token has no lifecycle semantics
- token is only used to validate the `/token` exchange path

## IV. Sprint Boundary Locks

### Sprint 09

- Owns authorization-code exchange baseline only.
- Must NOT introduce:
  - JWT access_token behavior
  - claims finalization
  - signing / key usage
  - client-final OIDC access-token semantics
  - refresh/revoke/rotation/introspection/session/SSO

### Sprint 10

- Owns:
  - JWT access_token formalization
  - ID Token issuance
  - claims mapping
  - `/userinfo`
  - scope-based claim output
  - client-usable OIDC token response semantics

Precondition:

- Sprint 10 MUST NOT begin JWT implementation until the JWT access-token contract is written and approved.

### Phase 05

- Owns lifecycle hardening:
  - refresh token lifecycle
  - rotation
  - revoke
  - introspection
  - session / SSO

## V. Updated Source-of-Truth Targets

- `docs/planning/assignments/phase-04-sprint-09.md` (updated)
- `docs/planning/assignments/phase-04-sprint-10.md` (update only if file exists in branch)
- `docs/planning/phases/phase-04-oidc-core.md` (updated)
- `docs/planning/reports/phase-04-sprint-09-report.md` (update required only if file exists in branch)

## VI. Immediate Next Actions

1. Keep Sprint 09 reported as completed baseline exchange only.
2. Approve `docs/contracts/oidc/jwt-token-contract.md`.
3. Start Sprint 10 implementation only after contract approval.
4. Preserve Phase 05 ownership boundaries for refresh/rotation/revoke/introspection/session/SSO.

## VII. Next Step

Sprint 10 is blocked until `docs/contracts/oidc/jwt-token-contract.md` is approved.
