# Phase 02 - Sprint 05

## I. Sprint Identity

- Phase: Phase 02 - Identity Core
- Sprint: Sprint 05 - Auth Module
- Objective: Implement `auth` as the credential validation layer for local identity authentication, strictly separated from identity ownership and token/session lifecycle.
- Status: Ready for implementation
- Scope type: Sprint-level and task-level execution
- Priority: High
- Branch: `feature/auth-sprint05-credential-validation`
- Owner module: `src/modules/auth`

Task Identity:

- Scope: Sprint-level + task-level execution
- Related tasks:
  - Task 19 - Auth Service
  - Task 20 - Auth Controller
  - Task 21 - Auth Validator / DTO Contract

---

## II. Objective

Implement `modules/auth` as the module responsible for **credential validation only**.

Sprint 05 must establish the auth validation flow:

- receive login input
- validate login input shape
- retrieve user identity through approved `users` contracts
- compare password against stored hash
- return authentication result suitable for downstream OIDC flow continuation
- reject invalid credentials safely

Sprint 05 must enforce:

- no token generation
- no session issuance
- no identity ownership
- no direct database access
- no user enumeration through credential error handling

Strictly forbidden:

- token or JWT logic
- OIDC authorization or token flow
- refresh token logic
- session management
- verification or password-reset flow
- direct persistence ownership
- infrastructure expansion unless separately approved

---

## III. Source-of-Truth Basis

- `docs/source-of-truth-index.md`
- `docs/README.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/module-boundaries.md`
- `docs/architecture/source-tree.md`
- `docs/architecture/detailed-source-tree.md`
- `docs/requirements/srs-v1.md`
- `docs/planning/master-execution-plan.md`
- `docs/planning/phases/phase-02-identity-core.md`
- `docs/governance/git-rules.md`
- `docs/governance/pr-template.md`
- `docs/governance/review-checklist.md`
- `docs/governance/anti-patterns.md`
- `docs/planning/reports/phase-02-sprint-04-report.md`

Conflict rules:

- `docs/source-of-truth-index.md` wins first
- `docs/architecture/source-tree.md` overrides `docs/architecture/detailed-source-tree.md`

---

## IV. Scope

Included:

- `auth` module credential validation layer
- login input validation
- auth service orchestration
- auth controller handler for login
- safe password comparison using approved crypto abstraction
- identity lookup through approved `users` contracts only
- sanitized authentication result payload
- error mapping for invalid input and invalid credentials
- boundary and governance validation

Excluded:

- token generation
- JWT / refresh token / ID token logic
- OIDC `/authorize` or `/token`
- session creation or storage
- verification flow
- password-reset flow
- identity persistence ownership
- direct database access
- Mongoose model/repository under `auth`
- client management
- infrastructure expansion
- identity duplication outside `users`

Required deliverables:

- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.validator.ts`

Optional only if justified by implementation clarity and existing structure:

- `src/modules/auth/auth.types.ts`

---

## V. Tasks

### Task 19 - Auth Service

Implement `auth.service.ts` as the credential validation owner.

Required behavior:

- accept login input (`email`, `password`)
- retrieve user via approved `users` contract using email
- compare input password against stored `password_hash` through approved crypto abstraction
- return sanitized authentication result on success
- return controlled authentication failure on invalid credentials
- avoid leaking whether email exists or password is wrong

Rules:

- `auth` does not query database directly
- `auth` does not own identity persistence
- `auth` does not generate tokens
- `auth` does not create session state
- `auth` must not expose `password_hash`

Suggested method contract:

- `validateCredentials(email, password)`

Suggested success payload:

- `sub`
- `email`
- `name`
- `avatar_url`
- `email_verified`

Suggested failure policy:

- invalid credential outcome -> `401 Unauthorized`
- invalid input -> `400 Bad Request`

### Task 20 - Auth Controller

Implement `auth.controller.ts` as a thin delivery adapter for credential validation.

Required endpoint:

- login handler

Suggested route shape:

- `POST /auth/login`

Required behavior:

- validate request through approved validator
- delegate credential validation to auth service
- return standardized success/error response
- never include password or hash in response

Rules:

- controller logic must remain minimal
- no business logic in controller
- no token/session/OIDC logic
- no direct database or crypto handling in controller

### Task 21 - Auth Validator / DTO Contract

Implement `auth.validator.ts` for login input validation.

Required input contract:

- `email`
- `password`

Validation goals:

- reject missing required fields
- reject malformed email
- reject structurally invalid password input
- keep validation centralized and reusable

Rules:

- validator must remain auth-scoped
- do not move auth-specific workflow logic into `shared`
- no domain ownership leakage into validator

---

## VI. Boundary Rules

Domain rules:

- `auth` validates credentials only
- `users` remains the single source of truth for identity
- `auth` may consume user identity through approved `users` contracts only
- successful authentication result must reference a valid user from `users`

Boundary rules:

- no business logic in `infrastructure`
- no token logic in `auth`
- no session logic in `auth`
- no direct database access outside the owning repository/module
- no cross-module ownership violation
- no internal users persistence/model import bypass if an approved service contract exists
- no user identity duplication inside `auth`

System rules:

- no `process.env` outside `config`
- follow `source-tree.md`
- no undocumented architecture change
- all changes must be traceable to Sprint 05
- respect governance and PR rules

Security rules:

- never log password or full credential payload
- never expose `password_hash`
- avoid account enumeration in credential failure responses
- use approved crypto abstraction for password compare only

---

## VII. Validation

Static validation:

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run format:check`
- `npm.cmd run build`

Boundary validation:

- no `process.env` outside `config`
- no `console.log`
- no direct DB access from `src/modules/auth`
- no token / JWT / session / OIDC logic in `src/modules/auth`

Suggested search checks:

- `rg -n "process\\.env" src --glob "!src/config/**"`
- `rg -n "console\\.log" src`
- `rg -n "mongoose|findOne|findById|create\\(" src/modules/auth`
- `rg -n "jwt|token|session|authorize|refresh|oidc" src/modules/auth`

Runtime validation:

- valid email + valid password -> success
- valid email + wrong password -> `401`
- unknown email + any password -> `401`
- invalid input -> `400`
- response excludes `password_hash`
- auth result returns only approved identity fields
- auth service uses users contract, not direct DB access

Manual validation:

- verify no password/hash leakage in response
- verify no token/session/OIDC flow logic is introduced
- verify correct file placement
- verify auth depends on users only within approved direction
- verify credential comparison uses approved crypto abstraction

Suggested commands to record in the task report:

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run format:check`
- `npm.cmd run build`

Acceptance Criteria (global):

- auth service validates credentials successfully through users + crypto abstractions
- invalid credentials return controlled `401`
- invalid input returns controlled `400`
- no direct DB access exists in `auth`
- no token/session/OIDC logic exists in `auth`
- no identity ownership is duplicated in `auth`
- all validations pass
- implementation matches source-of-truth

---

## VIII. Completion Rule

Sprint 05 is complete only when:

- auth module provides credential validation only
- login validation works with email + password
- authentication result is suitable for downstream OIDC flow continuation
- invalid credentials are handled safely with controlled `401`
- invalid input is handled with controlled `400`
- no token generation exists in `auth`
- no session lifecycle exists in `auth`
- no direct persistence ownership exists in `auth`
- no boundary violation is detected
- validation evidence is complete
- task report is submitted
- PR is compliant with governance
- handoff note for the next approved phase/sprint is provided

Commit format:

- `<type>(<scope>): <message>`

Suggested commits:

- `feat(auth): implement credential validation service`
- `feat(auth): add login controller handler`
- `feat(auth): add login validator contract`

PR requirements:

- must stay within Sprint 05 scope
- must include validation evidence
- must reference Phase 02 / Sprint 05 / Tasks 19-21
- must pass all quality gates
- must not introduce architecture drift

Required task report:

- task identity
- source-of-truth used
- files created or updated
- commands executed
- validation results
- scope included and excluded
- risks or limitations
- handoff note for next step
