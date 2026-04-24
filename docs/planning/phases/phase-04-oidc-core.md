# Phase 04 - OIDC Core

---

## I. Overview

### Objective

Implement the OpenID Connect provider core required to start the Authorization Code Flow while preserving strict separation between:

- identity ownership: `users`
- credential validation: `auth`
- OIDC protocol, token endpoint, and claims output: `oidc`

Phase 04 turns the approved identity and account-lifecycle foundation into the initial OIDC provider flow. It does not change Phase 03 lifecycle-token behavior and does not introduce Phase 05 token/session lifecycle management.

---

## II. Contract Basis

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

## III. Scope

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

## IV. Boundary Separation

### Phase 03 separation

- OIDC tokens are not Phase 03 lifecycle tokens.
- `token-lifecycle` must not be reused for access tokens, refresh tokens, ID tokens, authorization codes, or sessions.
- Verification and password reset remain owned by Phase 03 modules.

### Phase 05 separation

- Phase 04 may define the minimum token endpoint behavior needed for authorization code exchange.
- Phase 04 must not absorb Phase 05 token/session lifecycle scope.
- Refresh token management, rotation, revocation, introspection, SSO behavior, logout behavior, and broader session lifecycle work remain Phase 05 concerns unless an approved contract narrows a Phase 04 baseline requirement.

---

## V. Module Ownership

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

---

### auth

Owns:

- local credential validation only
- authentication result needed for OIDC continuation

Must NOT:

- generate access tokens, refresh tokens, ID tokens, authorization codes, or sessions
- own OIDC protocol behavior

---

### users

Owns:

- user identity data
- approved identity lookup and mutation contracts

Must NOT:

- own OIDC protocol behavior
- issue OIDC tokens
- expose raw persistence internals to `oidc`

---

## VI. Phase Breakdown

| Sprint | Scope |
| --- | --- |
| Sprint 08 | Provider Foundation + Authorization Endpoint |
| Sprint 09 | Token Endpoint + Authorization Code Exchange |
| Sprint 10 | ID Token + Claims + UserInfo |

---

## VII. Sprint 08 - Provider Foundation + Authorization Endpoint

### Goal

Establish the OIDC provider foundation and expose the authorization endpoint boundary for Authorization Code Flow + PKCE.

### Scope

High-level scope:

- provider bootstrap
- `/authorize` endpoint surface
- authorization request validation
- PKCE challenge handling
- client and redirect URI validation required by `/authorize`
- handoff to `auth` for credential validation only

### Deliverable Direction

Sprint 08 should leave the codebase ready to accept and validate authorization requests through the OIDC module, with credential verification delegated to `auth` and user identity access limited to approved `users` contracts.

### Boundary Rules

- `oidc` owns the authorization protocol flow.
- `auth` validates credentials only.
- `users` remains the identity source of truth.
- Sprint 08 must not issue OIDC tokens or introduce token/session lifecycle behavior.

---

## VIII. Sprint 09 - Token Endpoint + Authorization Code Exchange

### Goal

Define the token endpoint core for exchanging a valid authorization code under the approved Authorization Code Flow + PKCE contract.

### Scope

High-level scope:

- `/token` endpoint
- authorization code validation
- PKCE verifier check
- client validation required by token exchange
- token response baseline required by the approved core flow

### Deliverable Direction

Sprint 09 should establish the OIDC-owned token endpoint exchange path and prepare the token response integration surface for Sprint 10 identity output, without moving credential validation or lifecycle-token behavior into the wrong module.

### Boundary Rules

- `auth` must not generate tokens
- `oidc` must not reuse `token-lifecycle`
- `oidc` must not query user persistence directly
- Phase 05 lifecycle behavior must not be introduced in Sprint 09
- Refresh token rotation, revocation, introspection, and broader lifecycle management remain Phase 05 concerns.

---

## IX. Sprint 10 - ID Token + Claims + UserInfo

### Goal

Complete the identity output surface for the OIDC core flow through signed ID Tokens, approved claim mapping, and baseline UserInfo response behavior.

### Scope

High-level scope:

- ID Token RSA signing
- claims mapping
- `/userinfo` baseline
- scope-based claim output

### Deliverable Direction

Sprint 10 should produce the OIDC identity output baseline by mapping authoritative user identity into approved claims and exposing those claims through ID Token and UserInfo behavior.

### Boundary Rules

- no raw DB projection
- claim output must use the approved mapper
- `oidc` must consume user identity only through approved `users` contracts
- `users` must not own OIDC claim or token behavior
- UserInfo must not become a direct user persistence projection

---

## X. Validation

Required validation posture:

- standard repository validation
- contract traceability
- boundary review

Boundary checks:

- no token logic in auth
- no direct user DB access from `oidc`
- no reuse of Phase 03 `token-lifecycle`
- no Phase 05 token/session lifecycle leakage
- no duplicate identity ownership

---

## XI. Definition of Done

- `/authorize` works according to approved contract
- `/token` works according to approved contract
- PKCE enforced
- ID Token signed
- claims are mapped through approved mapper
- `/userinfo` baseline returns mapped claims according to approved scopes
- `users`, `auth`, and `oidc` ownership remains separated
- no boundary violations

---

## XII. Handoff to Phase 05

Phase 04 produces the OIDC core flow baseline.

Phase 05 remains responsible for secure token and session lifecycle expansion, including:

- access token lifecycle management
- refresh token lifecycle management
- rotation
- revocation
- session management
- SSO behavior
