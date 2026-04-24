# Phase 04 - Sprint 10

## I. Sprint Identity

- Phase: Phase 04 - OIDC Core
- Sprint: Sprint 10 - JWT Access Token Formalization + ID Token + Claims + UserInfo
- Objective: Formalize client-usable OIDC token output by locking JWT access_token contract, implementing ID Token issuance, claims mapping, and `/userinfo` scope-based claim output.
- Status: Contract definition required before implementation
- Scope type: Sprint-level and task-level execution
- Priority: High
- Owner module: `src/modules/oidc`

---

## II. Objective

Sprint 10 owns OIDC identity/token output formalization:

- JWT access_token formalization
- ID Token issuance
- claims mapping
- `/userinfo`
- scope-based claim output
- client-usable OIDC token response semantics

Mandatory precondition:

- Sprint 10 MUST NOT start JWT implementation until the JWT access-token contract is written and approved.

---

## III. Source-of-Truth Basis

- `docs/source-of-truth-index.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/module-boundaries.md`
- `docs/architecture/source-tree.md`
- `docs/requirements/srs-v1.md`
- `docs/planning/master-execution-plan.md`
- `docs/planning/phases/phase-04-oidc-core.md`
- `docs/planning/assignments/phase-04-sprint-09.md`

### Conflict Rules

- `docs/source-of-truth-index.md` wins first
- architecture documents override planning documents
- `source-tree.md` overrides `detailed-source-tree.md`
- no approved token/claims contract -> no implementation

---

## IV. JWT Access Token Contract (MUST DEFINE BEFORE CODE)

Sprint 10 must define and approve all of the following before implementation:

- signing algorithm (for example `RS256`)
- issuer (`iss`)
- audience (`aud`)
- subject (`sub`)
- expiration (`exp`)
- issued-at (`iat`)
- scope representation
- claim set boundary
- relationship between access_token and ID Token
- relationship between access_token and `/userinfo`
- key/JWKS usage
- validation expectations for clients

Rules:

- no ad-hoc JWT field decisions during implementation
- no implementation before contract approval
- no mixing Phase 05 lifecycle hardening into Sprint 10 token contract work

---

## V. Scope

### Included

- JWT access_token formalization (after contract approval)
- ID Token issuance
- claims mapping
- `/userinfo` endpoint behavior
- scope-based claim output
- client-usable OIDC token response semantics

### Excluded

- refresh token lifecycle
- rotation
- revoke
- introspection
- session / SSO
- Phase 05 lifecycle hardening
- direct user DB access from `oidc`
- token generation in `auth`
- `token-lifecycle` usage for OIDC token behavior

---

## VI. Boundary Rules

### Sprint 09 separation (must preserve)

- Sprint 09 access_token is a baseline placeholder used to validate the authorization-code exchange path. It is not a finalized OIDC access token and is not yet client-usable.
- Sprint 09 must not be reported as final OIDC client-usable token behavior.

### Sprint 10 ownership

- Sprint 10 owns JWT access_token formalization, ID Token, claims mapping, and `/userinfo`.
- Sprint 10 must deliver contract-backed client-usable token output semantics.

### Phase 05 ownership (must remain out of Sprint 10)

- refresh token lifecycle
- rotation
- revoke
- introspection
- session / SSO

---

## VII. Validation

### Static

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run format:check`
- `npm.cmd run build`

### Boundary

- no token generation in `auth`
- no direct user DB access from `oidc`
- no `token-lifecycle` reuse for OIDC token behavior
- no Phase 05 lifecycle leakage into Sprint 10 scope

### Contract gate checks

- JWT access-token contract document exists and is approved before implementation
- contract contains all mandatory fields from Section IV
- implementation matches the approved JWT contract

---

## VIII. Completion Rule

Sprint 10 is complete when:

- JWT access_token contract is approved before implementation
- JWT access_token implementation matches approved contract
- ID Token is issued according to approved contract
- claims mapping is implemented and validated
- `/userinfo` returns scope-based claims via approved mapping
- no Phase 05 lifecycle logic is introduced
- validation evidence is complete

---

## IX. Handoff

Sprint 10 completes Phase 04 identity/token output baseline.

Phase 05 remains responsible for lifecycle hardening:

- refresh token lifecycle
- rotation
- revoke
- introspection
- session / SSO
