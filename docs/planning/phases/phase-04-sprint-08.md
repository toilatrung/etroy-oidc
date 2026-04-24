# Phase 04 - Sprint 08

## I. Sprint Identity

- Phase: Phase 04 - OIDC Core
- Sprint: Sprint 08 - Provider Foundation + Authorization Endpoint
- Objective: Implement OIDC provider foundation and `/authorize` endpoint for Authorization Code Flow + PKCE, strictly separated from identity ownership and token lifecycle.
- Status: Ready for implementation
- Scope type: Sprint-level and task-level execution
- Priority: High
- Branch: `feature/oidc-sprint08-authorize-foundation`
- Owner module: `src/modules/oidc`

### Task Identity

- Scope: Sprint-level + task-level execution
- Related tasks:
  - Task 31 - OIDC Provider Bootstrap
  - Task 32 - Authorization Endpoint (`/authorize`)
  - Task 33 - Authorization Request Validation
  - Task 34 - PKCE Handling
  - Task 35 - Client & Redirect URI Validation
  - Task 36 - Auth Integration Bridge

---

## II. Objective

Implement OIDC foundation for Authorization Code Flow:

- initialize OIDC provider
- expose `/authorize` endpoint
- validate authorization request
- validate PKCE parameters
- validate client and redirect URI
- delegate credential validation to `auth`
- prepare authorization flow continuation (no code issuance)

Sprint 08 must enforce:

- no token generation
- no authorization code issuance
- no session creation
- no identity ownership
- no direct database access from `oidc`

Strictly forbidden:

- `/token` endpoint
- access token / refresh token / ID token logic
- session management / SSO
- lifecycle token reuse
- direct user DB queries
- credential validation inside `oidc`

---

## III. Source-of-Truth Basis

- `docs/source-of-truth-index.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/module-boundaries.md`
- `docs/architecture/source-tree.md`
- `docs/requirements/srs-v1.md`
- `docs/planning/master-execution-plan.md`
- `docs/planning/phases/phase-04-oidc-core.md`
- `docs/governance/git-rules.md`
- `docs/governance/pr-template.md`
- `docs/governance/review-checklist.md`
- `docs/governance/anti-patterns.md`

### Conflict Rules

- `docs/source-of-truth-index.md` wins first
- `source-tree.md` overrides `detailed-source-tree.md`
- no contract -> no implementation

---

## IV. Scope

### Included

- OIDC provider bootstrap
- `/authorize` endpoint handler
- authorization request parsing and validation
- PKCE challenge validation (`code_challenge`, `method`)
- client validation (`client_id`)
- `redirect_uri` validation
- integration with `auth` for credential validation
- preparation for authorization flow continuation

### Excluded

- `/token` endpoint
- authorization code issuance
- access token / refresh token / ID token
- session management
- userinfo endpoint
- client management
- verification / password-reset flows
- token-lifecycle usage
- direct DB access

### Required Deliverables

- `src/modules/oidc/oidc.provider.ts`
- `src/modules/oidc/oidc.service.ts`
- `src/modules/oidc/oidc.controller.ts`

Optional:

- `src/modules/oidc/oidc.validator.ts`
- `src/modules/oidc/oidc.types.ts`

---

## V. Tasks

### Task 31 - OIDC Provider Bootstrap

- initialize OIDC provider instance
- configure issuer and supported flow (Authorization Code + PKCE)
- integrate with Express app

Rules:

- no token logic
- no business logic in bootstrap

---

### Task 32 - Authorization Endpoint (`/authorize`)

- accept request
- parse:
  - `client_id`
  - `redirect_uri`
  - `response_type`
  - `scope`
  - `code_challenge`
  - `code_challenge_method`
- delegate to service

Rules:

- controller must be thin
- no validation logic here

---

### Task 33 - Authorization Request Validation

- validate required params
- validate `response_type = code`
- validate scope format

Failure:

- invalid -> `400 Bad Request`

---

### Task 34 - PKCE Handling

- validate `code_challenge`
- validate method (`S256`)
- enforce PKCE required

Rules:

- no verifier storage
- no code generation

---

### Task 35 - Client & Redirect URI Validation

- validate `client_id`
- validate `redirect_uri`

Rules:

- strict validation
- no DB bypass

Client Validation Contract:

- source: config allowlist
- shape:
  - `type OidcClient = { clientId: string; redirectUris: string[] }`
- rules:
  - `client_id` must exist
  - `redirect_uri` must match exactly one entry
  - no wildcard, prefix, or partial matching
  - no persistence layer in Sprint 08

---

### Task 36 - Auth Integration Bridge

- call `auth` for credential validation
- receive identity:
  - `sub`
  - `email`
  - `email_verified`

Rules:

- no password validation in `oidc`
- no direct DB access

---

## VI. Boundary Rules

### Domain Rules

- `oidc` -> protocol only
- `auth` -> credential validation
- `users` -> identity

### Forbidden

- token generation in `auth`
- direct DB access from `oidc`
- token-lifecycle reuse
- identity mutation from `oidc`
- session logic

### System Rules

- no `process.env` outside config
- follow `source-tree.md`
- no undocumented structure

### Security Rules

- no credential leakage
- strict `redirect_uri` validation
- enforce PKCE

---

## VII. Validation

### Static

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run format:check`
- `npm.cmd run build`

### Boundary

- no `process.env` outside config
- no `console.log`
- no token logic in `oidc`

### Suggested Checks

- `rg -n "process\\.env" src --glob "!src/config/**"`
- `rg -n "console\\.log" src`
- `rg -n "jwt|token|refresh|session" src/modules/oidc`
- `rg -n "UserModel|findById|findOne" src/modules/oidc`

### Runtime

- valid request -> accepted
- missing PKCE -> rejected
- invalid `redirect_uri` -> rejected
- invalid `client_id` -> rejected

### Manual

- controller thin
- auth delegation correct
- no boundary violation

---

## VIII. Completion Rule

Sprint 08 is complete when:

- provider initialized
- `/authorize` works
- request validation correct
- PKCE enforced
- client + redirect validated
- auth integration works
- no token issued
- no session created
- no boundary violation
- validation evidence complete

---

## IX. Commit Suggestion

- `feat(oidc): bootstrap provider foundation`
- `feat(oidc): implement authorize endpoint`
- `feat(oidc): add pkce validation`
- `feat(oidc): integrate auth validation bridge`

---

## X. Handoff

Next Sprint:

- Sprint 09 - Token Endpoint + Authorization Code Exchange

Handoff requirements:

- preserve PKCE data
- prepare context for code exchange
- no token/session logic introduced
