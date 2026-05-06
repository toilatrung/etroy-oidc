# Phase 04 - Sprint 10

## I. Sprint Identity

- Phase: Phase 04 - OIDC Core
- Sprint: Sprint 10 - ID Token + Claims + UserInfo
- Objective: Finalize client-usable OIDC token layer using approved JWT contract
- Status: CLOSED
- Owner module: `src/modules/oidc`

Execution status:

- Sprint 10 has been implemented and validated. Previously open runtime validation gaps for scoped `/userinfo` claims and invalid JWT rejection were closed by Tester Postman evidence.

---

## II. Objective

Complete OIDC token layer for client consumption:

- JWT access_token (final form)
- ID Token issuance
- claims mapping
- `/userinfo` endpoint

All implementation MUST follow:

- `docs/contracts/oidc/jwt-token-contract.md`

Constraint:

- All implementation MUST strictly follow the JWT contract.
- No deviation or interpretation is allowed.

---

## III. Source-of-Truth Basis

- docs/source-of-truth-index.md
- docs/architecture/system-overview.md
- docs/architecture/module-boundaries.md
- docs/architecture/source-tree.md
- docs/requirements/srs-v1.md
- docs/planning/master-execution-plan.md
- docs/planning/phases/phase-04-oidc-core.md
- docs/contracts/oidc/jwt-token-contract.md

---

## IV. Scope

### Included

- JWT access_token issuance
- ID Token issuance
- claims.mapper implementation
- `/userinfo` endpoint
- scope-based claims output

### Excluded

- refresh token
- revoke
- introspection
- session / SSO
- Phase 05 lifecycle
- token-lifecycle reuse
- direct DB access from oidc

---

## V. Deliverables

Required:

```
src/modules/oidc/
  access-token.provider.ts
  id-token.provider.ts
  claims.mapper.ts
  userinfo.controller.ts
  userinfo.service.ts
```

---

## VI. Tasks

### Task 41 - JWT Access Token Implementation

- implement JWT access_token using RS256
- include required claims
- integrate with JWKS

Acceptance:

- token is signed
- token matches contract
- exp/iat correct

---

### Task 42 - ID Token Implementation

- implement ID Token
- include required + scope-based claims

Acceptance:

- signed JWT
- correct claims
- no sensitive fields

---

### Task 43 - Claims Mapper

- map user identity to OIDC claims

Acceptance:

- no DB access
- no mutation
- contract-aligned output

---

### Task 44 - UserInfo Endpoint

- implement GET /userinfo
- validate access_token
- return scope-based claims

Acceptance:

- token verified
- correct claim filtering
- no raw DB exposure

---

### Task 45 - Token Response Finalization

- update `/token` response
- include access_token + id_token

Acceptance:

- matches contract
- no refresh token

---

## VII. Boundary Rules

### oidc

Owns:

- token issuance
- claims mapping
- /userinfo

Must NOT:

- query user DB directly
- reuse token-lifecycle
- implement session/refresh logic

### auth

- credential validation only
- MUST NOT generate tokens

### users

- identity source only
- MUST NOT issue tokens

---

## VIII. Validation

### Static

```
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run format:check
npm.cmd run build
```

### Boundary

```
rg -n "UserModel" src/modules/oidc
rg -n "token-lifecycle" src/modules/oidc
rg -n "refresh|session|revoke" src/modules/oidc
rg -n "jwt|token" src/modules/auth
```

### Runtime

- JWT verify success
- invalid token rejected
- /userinfo returns scoped claims

---

## IX. Definition of Done

- access_token is JWT
- ID Token issued
- claims mapped correctly
- /userinfo works
- no boundary violation
- validation passes

---

## X. Commit Suggestion

- feat(oidc): implement jwt access token
- feat(oidc): add id token support
- feat(oidc): implement userinfo endpoint

---

## XI. Handoff

Next Phase: Phase 05

- refresh token lifecycle
- session management
- SSO
