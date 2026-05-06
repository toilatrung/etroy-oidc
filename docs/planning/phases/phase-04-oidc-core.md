# Phase 04 - OIDC Core

---

## I. Status

- Status: CLOSED
- Implementation range: Sprint 08 - Sprint 10

Closure basis:

- Sprint 08 authorize validation completed.
- Sprint 09 token endpoint and authorization-code exchange baseline completed.
- Sprint 10 JWT access token, ID Token, claims mapper, and /userinfo completed.
- Tester Postman evidence closed the previously open Sprint 10 runtime validation gaps.

---

## II. Overview

### Objective

Implement the OpenID Connect provider core required to start the Authorization Code Flow while preserving strict separation between:

- identity ownership: `users`
- credential validation: `auth`
- OIDC protocol, token endpoint, and claims output: `oidc`

Phase 04 turns the approved identity and account-lifecycle foundation into the initial OIDC provider flow. It does not change Phase 03 lifecycle-token behavior and does not introduce Phase 05 token/session lifecycle management.

---

## III. Contract Basis

Phase 04 execution remains governed by:

- `docs/planning/master-execution-plan.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/module-boundaries.md`
- `docs/requirements/srs-v1.md`
- approved API, flow, client, and claim contracts created before implementation

Rules:

- no contract -> no code
- `docs/` remains authoritative
- `agent/` context may support execution only and must not redefine Phase 04 scope

---

## IV. Scope

### Included

- OIDC provider bootstrap
- `/authorize` endpoint surface
- `/token` endpoint surface for authorization code exchange
- Authorization Code Flow + PKCE
- authorization code issuance and validation
- client and redirect URI validation needed by the core flow
- ID Token RSA signing
- claims mapping through approved user identity contracts
- `/userinfo` baseline for mapped claim output

### Excluded

- verification flow (Phase 03)
- password reset flow (Phase 03)
- `token-lifecycle` reuse or dependency for OIDC tokens
- Phase 05 access/refresh token lifecycle management
- refresh token rotation, revocation, introspection, or persistence policy beyond approved core-flow contracts
- OIDC session management, SSO behavior, and logout hardening
- client management/admin workflows
- new identity ownership behavior

---

## V. Boundary Separation

### Phase 03 separation

- OIDC tokens are not Phase 03 lifecycle tokens.
- `token-lifecycle` must not be reused for access tokens, refresh tokens, ID tokens, authorization codes, or sessions.
- Verification and password reset remain owned by Phase 03 modules.

### Phase 05 separation

- Phase 04 may define the minimum token endpoint behavior needed for authorization code exchange.
- Phase 04 must not absorb Phase 05 token/session lifecycle scope.
- Refresh token management, rotation, revocation, introspection, SSO behavior, logout behavior, and broader session lifecycle work remain Phase 05 concerns unless an approved contract narrows a Phase 04 baseline requirement.

---

## VI. Module Ownership

### oidc

Owns:

- protocol flow
- provider bootstrap
- `/authorize`
- `/token`
- authorization code handling
- ID Token signing
- claims mapping
- `/userinfo` claim output

Must NOT:

- query user ownership storage directly
- generate or mutate identity data
- validate credentials itself
- reuse Phase 03 `token-lifecycle`
- implement Phase 05 token/session lifecycle management prematurely

### auth

Owns:

- local credential validation only
- authentication result needed for OIDC continuation

Must NOT:

- generate access tokens, refresh tokens, ID tokens, authorization codes, or sessions
- own OIDC protocol behavior

### users

Owns:

- user identity data
- approved identity lookup and mutation contracts

Must NOT:

- own OIDC protocol behavior
- issue OIDC tokens
- expose raw persistence internals to `oidc`

---

## VII. Phase Breakdown

| Sprint | Scope |
| --- | --- |
| Sprint 08 | Provider Foundation + Authorization Endpoint |
| Sprint 09 | Token Endpoint + Authorization Code Exchange |
| Sprint 10 | ID Token + Claims + UserInfo |

---

## VIII. Sprint 08 - Provider Foundation + Authorization Endpoint

### Goal

Establish the OIDC provider foundation and expose the authorization endpoint boundary for Authorization Code Flow + PKCE.

### Scope

- provider bootstrap
- `/authorize` endpoint surface
- authorization request validation
- PKCE challenge handling
- client and redirect URI validation required by `/authorize`
- handoff to `auth` for credential validation only

### Boundary Rules

- `oidc` owns the authorization protocol flow.
- `auth` validates credentials only.
- `users` remains the identity source of truth.
- Sprint 08 must not issue OIDC tokens or introduce token/session lifecycle behavior.

---

## IX. Sprint 09 - Token Endpoint + Authorization Code Exchange

### Goal

Define the token endpoint core for exchanging a valid authorization code under the approved Authorization Code Flow + PKCE contract.

### Scope

- `/token` endpoint
- authorization code issuance, repository-based persistence, and validation
- PKCE verifier check
- client validation required by token exchange
- baseline `access_token` generation as a real token with minimal lifecycle only
- token response baseline required by the approved core flow:
  - `access_token`
  - `token_type`
  - `expires_in`

Mandatory clarification:

- Sprint 09 access_token is a baseline placeholder used only to validate the authorization-code exchange path. It is not a finalized OIDC client-usable access token. JWT access_token formalization is locked to Sprint 10 and must not be implemented before the Sprint 10 contract is approved.

### Boundary Rules

- `auth` must not generate tokens
- `oidc` must not reuse `token-lifecycle`
- `oidc` must not query user persistence directly
- Sprint 09 may issue a real baseline `access_token`, but it must not introduce refresh, revoke, rotation, introspection, session, or SSO behavior
- Sprint 09 must not introduce JWT access-token semantics, claims finalization, or signing/key behavior
- JWT access_token formalization, ID Token, claims, and `/userinfo` remain Sprint 10 concerns
- Phase 05 lifecycle behavior must not be introduced in Sprint 09

---

## X. Sprint 10 - ID Token + Claims + UserInfo

### Goal

Complete the client-usable OIDC token and identity output surface by formalizing JWT access_token contract/implementation, signed ID Tokens, approved claims mapping, and baseline UserInfo response behavior.

### Scope

- JWT access_token formalization (contract-first)
- ID Token RSA signing
- claims mapping
- `/userinfo` baseline
- scope-based claim output
- client-usable OIDC token response semantics

Mandatory precondition:

- Sprint 10 implementation MUST follow: `docs/contracts/oidc/jwt-token-contract.md`
- no contract -> no implementation

### Boundary Rules

- no raw DB projection
- claim output must use the approved mapper
- `oidc` must consume user identity only through approved `users` contracts
- `users` must not own OIDC claim or token behavior
- UserInfo must not become a direct user persistence projection
- no Phase 05 lifecycle hardening in Sprint 10

---

## XI. Validation

Required validation posture:

- standard repository validation
- contract traceability
- boundary review
- tester runtime evidence

Boundary checks:

- no token logic in auth
- no direct user DB access from `oidc`
- no reuse of Phase 03 `token-lifecycle`
- no Phase 05 token/session lifecycle leakage
- no duplicate identity ownership

---

## XII. Definition of Done

- `/authorize` works according to approved contract
- `/token` works according to approved contract
- PKCE enforced
- Sprint 09 access_token is baseline-only and explicitly non-final
- Sprint 10 JWT access-token contract is approved before implementation
- ID Token signed
- claims are mapped through approved mapper
- `/userinfo` baseline returns mapped claims according to approved scopes
- `users`, `auth`, and `oidc` ownership remains separated
- no boundary violations
- tester evidence has closed Phase 04 runtime validation gaps

---

## XIII. Handoff to Phase 05

Phase 04 produces the OIDC core flow baseline.

Phase 05 remains responsible for secure token and session lifecycle expansion, including:

- access token lifecycle management
- refresh token lifecycle management
- rotation
- revocation
- introspection if approved by Phase 05 planning
- session management
- SSO behavior
- logout hardening if approved by Phase 05 planning
