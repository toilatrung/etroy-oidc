# eTroy OIDC - Current Context

## I. Purpose

This file captures the current operational state of the project for fast session continuity.
It summarizes approved state and next actions without redefining architecture.

## II. Current Project State

- Documentation authority model is active: `docs/` is authoritative, `agent/` is support only.
- Phase 04 - OIDC Core: CLOSED.
- Sprint 08: CLOSED - authorize endpoint validation baseline.
- Sprint 09: CLOSED - token endpoint and authorization-code exchange baseline.
- Sprint 10: CLOSED - JWT access token, ID Token, claims mapper, and /userinfo.
- Tester Postman evidence closed the previously open Sprint 10 runtime validation gaps.
- Repo-wide format baseline drift is deferred to a later repository-wide cleanup and is not a Phase 04 blocker.
- Current next phase: Phase 05 - Token and Session Management.

## III. Phase 04 Closure Summary

Phase 04 was implemented through:

- Sprint 08 - Provider Foundation + Authorization Endpoint
- Sprint 09 - Token Endpoint + Authorization Code Exchange
- Sprint 10 - ID Token + Claims + UserInfo

Closure basis:

- Sprint 08 authorize validation completed.
- Sprint 09 authorization-code exchange baseline completed.
- Sprint 10 JWT access token, ID Token, claims mapper, and /userinfo completed.
- Tester Postman evidence closed the previously open scoped /userinfo claims and invalid/tampered JWT rejection runtime gaps.

## IV. Preserved Boundary Locks

### Phase 04

Phase 04 is closed as OIDC core baseline only.

Phase 04 must not be reopened to absorb:

- refresh token lifecycle
- refresh token rotation
- revoke
- introspection
- session management
- SSO behavior
- logout hardening
- client management/admin workflow expansion

### Phase 05

Phase 05 owns lifecycle hardening:

- access token lifecycle management
- refresh token lifecycle
- rotation
- revoke
- introspection if approved by Phase 05 planning
- session / SSO
- logout hardening if approved by Phase 05 planning

## V. Immediate Next Actions

1. Begin Phase 05 planning and implementation.
2. Preserve Phase 04 boundary closure.
3. Keep refresh token, session, SSO, revoke, introspection, and logout hardening under Phase 05, not Phase 04.
4. Handle repo-wide formatting baseline cleanup later as a separate repository-wide cleanup item.
