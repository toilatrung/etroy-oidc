# Phase 04 - Sprint 09

## I. Sprint Identity

- Phase: Phase 04 - OIDC Core
- Sprint: Sprint 09 - Token Endpoint + Authorization Code Exchange
- Objective: Implement `/token`, authorization code issuance and exchange, and `access_token` baseline for Authorization Code Flow + PKCE while preserving strict separation from identity ownership and Phase 05 lifecycle hardening.
- Status: Ready for implementation
- Scope type: Sprint-level and task-level execution
- Priority: High
- Owner module: `src/modules/oidc`

---

## II. Objective

Implement the OIDC token-exchange baseline for Authorization Code Flow:

- issue authorization code from the OIDC flow
- persist authorization code through an OIDC-owned repository contract
- exchange valid authorization code at `/token`
- validate PKCE verifier
- validate client data required by token exchange
- generate `access_token` baseline as a real token with minimal lifecycle only
- return the minimum token response required by the approved Sprint 09 contract

Mandatory clarification:

- Sprint 09 access_token is a baseline placeholder used to validate the authorization-code exchange path. It is not a finalized OIDC access token and is not yet client-usable.

Sprint 09 must enforce:

- authorization code ownership stays in `oidc`
- authorization code must be one-time use
- authorization code must expire
- authorization code must be consumed on successful use
- `access_token` is real but not production lifecycle complete
- Sprint 09 `access_token` is NOT JWT and is NOT a finalized client-consumable OIDC access token
- Sprint 09 `access_token` has no claims contract, no signing semantics, and no lifecycle semantics
- no direct user DB access from `oidc`
- no hardcoded storage backend choice in this document

Strictly forbidden:

- `token-lifecycle` reuse
- ID Token issuance
- refresh token issuance
- rotation, revoke, or introspection logic
- session management / SSO
- lifecycle hardening beyond the Sprint 09 baseline
- token generation inside `auth`

---

## III. Source-of-Truth Basis

- `docs/source-of-truth-index.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/module-boundaries.md`
- `docs/architecture/source-tree.md`
- `docs/requirements/srs-v1.md`
- `docs/planning/master-execution-plan.md`
- `docs/planning/phases/phase-04-oidc-core.md`
- `docs/planning/assignments/phase-04-sprint-08.md`

### Conflict Rules

- `docs/source-of-truth-index.md` wins first
- architecture documents override planning documents
- `source-tree.md` overrides `detailed-source-tree.md`
- no contract -> no implementation

---

## IV. Scope

### Included

- `/token` endpoint handler
- authorization code secure generation
- authorization code persistence through an OIDC-owned repository contract
- authorization code validation
- authorization code expiration enforcement
- authorization code consume-on-use enforcement
- PKCE verifier validation against approved authorization context
- client validation required by token exchange
- `access_token` baseline generation as a real token with short TTL
- token response baseline with:
  - `access_token`
  - `token_type`
  - `expires_in`

### Excluded

- ID Token
- claims mapping
- `/userinfo`
- refresh token
- rotation
- revoke
- introspection
- session management
- SSO
- logout hardening
- `token-lifecycle` usage
- direct user DB access from `oidc`
- token generation inside `auth`

### Required Deliverables

- `src/modules/oidc/oidc.controller.ts`
- `src/modules/oidc/oidc.service.ts`
- OIDC-owned repository contract for authorization code persistence

Optional:

- `src/modules/oidc/oidc.types.ts`
- `src/modules/oidc/oidc.validator.ts`
- dedicated persistence implementation under `src/modules/oidc`

---

## V. Authorization Code Contract

Authorization code MUST:

- be securely generated
- be persisted through an OIDC-owned repository contract
- remain owned by `oidc`

Authorization code MUST enforce:

- one-time use
- expiration
- consume-on-use on successful exchange

Constraints:

- storage backend must remain consistent with approved architecture
- backend choice must not be hardcoded in this document
- repository access must not be bypassed
- `token-lifecycle` must not be reused

Sprint boundary clarification:

- Sprint 08 stops at `/authorize` request validation only.
- Sprint 09 introduces authorization code issuance, persistence, and exchange.
- Authorization code is issued as part of the OIDC `/authorize` flow owned by `oidc`.
- The issuance behavior itself belongs entirely to Sprint 09 scope.

---

## VI. Access Token Baseline Contract

Use the term:

- `access_token` baseline (real token, minimal lifecycle)

`access_token` baseline MUST:

- be a real token
- include `access_token`
- include `token_type`
- include `expires_in`
- have short TTL
- remain baseline-only in Sprint 09

`access_token` baseline MUST NOT include:

- JWT finalization
- claims contract finalization
- signing / RSA / JWK usage
- refresh token
- rotation
- revoke
- introspection
- session
- SSO

Mandatory statement:

- This token is NOT production lifecycle complete.
- This token is NOT yet a finalized client-consumable OIDC access token.

Format clarification:

- Sprint 09 MUST generate a real `access_token`, but the token format is not finalized in this sprint.
- Sprint 09 access_token is a baseline placeholder used to validate the authorization-code exchange path. It is not a finalized OIDC access token and is not yet client-usable.
- Sprint 09 MUST NOT introduce JWT semantics, claims finalization, signing, key/JWKS coupling, or client-facing authorization semantics.
- JWT access_token formalization is locked to Sprint 10 and must be implemented only after the Sprint 10 token/claims contract is approved.

---

## VII. Token Lifecycle Ownership

### Sprint 09

Owns:

- token exchange
- authorization code issuance, persistence, validation, and consume-on-use
- baseline `access_token` generation

### Sprint 10

Owns:

- JWT access_token formalization
- ID Token
- claims
- `/userinfo`

### Phase 05

Owns:

- refresh token (hashed)
- rotation
- revoke
- session / SSO

Mandatory constraint:

- lifecycle hardening MUST NOT be implemented in Sprint 09

---

## VIII. Tasks

### Token Endpoint (`/token`)

- accept the approved authorization-code grant inputs
- delegate token exchange orchestration to the OIDC service layer
- keep controller behavior thin

Rules:

- no business logic in controller
- no lifecycle hardening here

---

### Authorization Code Issuance and Persistence

- issue authorization code from the approved OIDC flow context
- persist authorization code through an OIDC-owned repository contract
- keep generation and persistence inside `oidc`

Rules:

- no `token-lifecycle` reuse
- no direct persistence bypass
- no hardcoded storage backend choice in the sprint contract

---

### Authorization Code Validation and Consume-on-Use

- validate authorization code presence and integrity
- reject expired authorization code
- reject reused authorization code
- invalidate authorization code immediately after successful exchange

Failure:

- invalid code exchange -> rejected deterministically

---

### PKCE Verifier Enforcement

- validate `code_verifier` against the approved PKCE challenge
- keep PKCE mandatory for authorization code exchange

Rules:

- no PKCE downgrade
- failed PKCE must reject token exchange

---

### Client Validation for Token Exchange

- validate the client data required by the approved token exchange contract
- validate `redirect_uri` consistency where required by the contract

Rules:

- strict validation only
- no raw DB query from `oidc`

---

### Baseline Access Token Generation

- generate a real `access_token` with short TTL
- return `access_token`, `token_type`, and `expires_in`
- keep token lifecycle intentionally minimal in Sprint 09

Rules:

- no refresh token
- no ID Token
- no rotation / revoke / introspection
- no session / SSO
- no JWT access-token formalization
- no claims contract finalization
- no signing / RSA / JWK usage for access_token

---

## IX. Boundary Rules

### oidc

Owns:

- OIDC protocol flow
- authorization code issuance and exchange
- baseline `access_token` generation

Must NOT:

- query user DB directly
- bypass repository access
- reuse `token-lifecycle`
- move lifecycle hardening into Sprint 09

### auth

Owns:

- credential validation only

Must NOT:

- generate authorization codes
- generate access tokens
- generate refresh tokens
- generate ID Tokens
- generate sessions

### users

Owns:

- identity only

Must NOT:

- own OIDC protocol behavior
- issue OIDC tokens
- expose raw persistence internals to `oidc`

---

## X. Validation

### Static

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run format:check`
- `npm.cmd run build`

### Boundary

- no `process.env` outside config
- no token generation in `auth`
- no direct user DB access from `oidc`
- no `token-lifecycle` reuse in `oidc`
- no session / refresh / revoke / introspection leakage in Sprint 09 scope

### Suggested Checks

- `rg -n "process\\.env" src --glob "!src/config/**"`
- `rg -n "console\\.log" src`
- `rg -n "UserModel|findById|findOne|mongoose" src/modules/oidc`
- `rg -n "token-lifecycle" src/modules/oidc`
- `rg -n "refresh|revoke|rotation|introspection|session|sso" src/modules/oidc`
- `rg -n "jwt|token" src/modules/auth`

### Runtime

- valid authorization code exchange -> returns `access_token`, `token_type`, `expires_in`
- reused authorization code -> rejected
- expired authorization code -> rejected
- invalid PKCE verifier -> rejected
- invalid client / `redirect_uri` -> rejected

### Manual

- repository boundary preserved
- wording is explicit and non-ambiguous
- no ID Token / session / lifecycle leakage
- token response remains baseline-only

---

## XI. Completion Rule

Sprint 09 is complete when:

- authorization code is issued and stored via repository
- `/token` works
- PKCE is enforced
- authorization code expiration is enforced
- authorization code one-time use is enforced
- authorization code is consumed on successful use
- `access_token` is generated as baseline only
- token response includes `access_token`, `token_type`, and `expires_in`
- no ID Token is issued
- no session is created
- no lifecycle logic is introduced beyond the Sprint 09 baseline
- no boundary violation exists
- validation evidence is complete

---

## XII. Handoff

Sprint 09 produces a non-final token system.
Sprint 09 implements only the authorization-code exchange baseline. The access_token is a placeholder and not yet a client-usable OIDC token. JWT-based access_token formalization is deferred to Sprint 10 and must only be implemented after contract approval.

Sprint 10 must complete:

- follow approved contract: `docs/contracts/oidc/jwt-token-contract.md`
- JWT access_token formalization
- ID Token
- claims
- `/userinfo`

Phase 05 MUST complete token lifecycle hardening:

- refresh token lifecycle
- rotation
- revoke
- session / SSO

Without Phase 05, the token system is NOT production-ready.
