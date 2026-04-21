# Phase 02 - Sprint 05 - Report

## I. Sprint Identity

- Phase: Phase 02 - Identity Core
- Sprint: Sprint 05 - Auth Module
- Objective: Establish `auth` as the credential validation layer for local identity authentication while preserving `users` identity ownership and excluding token, session, and OIDC lifecycle behavior.
- Branch: `feature/auth-sprint05-credential-validation`
- PR: Ready to open
- Status: Completed
- Date: 2026-04-21

Task identity:

- Task 19 - Auth Service
- Task 20 - Auth Controller
- Task 21 - Auth Validator / DTO Contract

## II. Source-of-Truth Used

- `docs/source-of-truth-index.md`
- `docs/README.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/module-boundaries.md`
- `docs/architecture/source-tree.md`
- `docs/requirements/srs-v1.md`
- `docs/planning/master-execution-plan.md`
- `docs/planning/phases/phase-02-identity-core.md`
- `docs/planning/assignments/phase-02-sprint-05.md`
- `docs/planning/reports/phase-02-sprint-04-report.md`
- `docs/governance/git-rules.md`
- `docs/governance/pr-template.md`
- `docs/governance/review-checklist.md`
- `docs/governance/anti-patterns.md`
- `agent/current-context.md`

Authority notes:

- `docs/` remained authoritative over `agent/`.
- `agent/current-context.md` still references Sprint 04, but Sprint 05 assignment in `docs/` controlled this work.
- No approved architecture, source-tree, or implementation scope reinterpretation was introduced.

## III. Work Completed

### Files Created / Updated

- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.validator.ts`
- `src/modules/users/user.service.ts`
- `docs/planning/assignments/phase-02-sprint-05.md`
- `docs/planning/reports/phase-02-sprint-05-report.md`

### Main Changes

- Implemented auth credential validation service with:
  - `email` and `password` input validation
  - identity lookup through the approved `users` service-level contract
  - password verification through the approved crypto abstraction
  - non-enumerating invalid credential handling with controlled `401`
  - sanitized success payload for downstream OIDC continuation
- Implemented a thin auth login controller handler that delegates validation and credential verification.
- Implemented auth-scoped DTO validation for login input.
- Added a narrow users service contract, `getCredentialIdentityByEmail`, so `auth` can validate credentials without importing users repository/model internals.
- Preserved route-tree scope control: login route wiring was not added because Sprint 05 delivers the auth controller handler only and does not expand delivery routing.

## IV. Validation Evidence

### Static Validation

- `npm.cmd run lint`: PASS
- `npm.cmd run typecheck`: PASS
- `npm.cmd run format:check`: PASS
- `npm.cmd run build`: PASS

### Boundary Validation

- `rg -n "process\\.env" src --glob "!src/config/**"`: PASS, no matches
- `rg -n "console\\.log" src`: PASS, no matches
- `rg -n "mongoose|findOne|findById|create\\(" src/modules/auth`: PASS, no matches
- `rg -n "jwt|token|session|authorize|refresh|oidc" src/modules/auth`: PASS, no matches
- `rg -n "password_hash|password" src/modules/auth`: PASS, expected password input and compare references only; no `password_hash`
- `rg -n "UserModel|user\\.model|user\\.repository" src/modules/auth`: PASS, no matches

### Manual Validation

Manual validation was executed against the built output with a fake users service contract and no live MongoDB dependency.

- valid email + valid password -> success: PASS
- valid email + wrong password -> controlled `401`: PASS
- unknown email + any password -> controlled `401`: PASS
- invalid input -> controlled `400`: PASS
- success payload contains only `sub`, `email`, `name`, `avatar_url`, `email_verified`: PASS
- success payload excludes `password_hash` and `passwordHash`: PASS
- success payload excludes token, session, and OIDC fields: PASS

## V. Scope Control

### Included

- `auth` credential validation layer
- login input validation for `email` and `password`
- auth service orchestration
- auth controller login handler
- safe password comparison through approved crypto abstraction
- identity lookup through users service contract
- sanitized authentication result payload
- controlled invalid input and invalid credential errors
- governance and boundary validation evidence

### Excluded

- token generation
- JWT, refresh token, ID token logic
- OIDC `/authorize`, `/token`, `/userinfo`, consent, logout, provider logic
- session creation, storage, issuance, or SSO behavior
- route-tree expansion beyond the approved controller deliverable
- verification flow
- password-reset flow
- client management
- admin flow
- audit expansion
- direct database access from `auth`
- Mongoose model or repository creation under `auth`
- infrastructure expansion
- identity mutation or persistence ownership in `auth`

### Required PR Statement

No token, session, or OIDC logic introduced in this PR.

Login route wiring is intentionally not included. This is scope control, not a missing feature, because Sprint 05 delivers credential validation and the controller handler only.

## VI. Risks / Notes

- The auth service receives a password hash through a narrow users service contract for comparison only. It does not expose the hash in the auth result, controller response, logs, or persistence.
- The users service remains the only module touching the users repository for identity lookup. `auth` does not import users repository/model internals.
- Live MongoDB runtime behavior was not exercised; manual validation used a fake users service contract to isolate auth behavior.
- PR still needs to be opened and reviewed through normal governance flow.

## VII. Current Status

- Implementation: Complete
- Assignment traceability: Complete, Sprint 05 assignment exists and is included for Git tracking
- Local validation: Complete
- Boundary validation: Complete
- Report: Complete
- PR readiness: Ready to open
- Phase status: Phase 02 ready to hand off after Sprint 05 review

## VIII. Handoff

Sprint 05 completed the credential validation layer required for downstream OIDC continuation.

Next approved work should remain outside `auth` unless a future source-of-truth assignment explicitly expands scope. Route registration, session lifecycle, token issuance, OIDC authorization, and provider behavior must be handled by their owning future sprint/module contracts.
