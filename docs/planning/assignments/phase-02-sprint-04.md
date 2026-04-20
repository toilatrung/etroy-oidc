# Phase 02 - Sprint 04

## I. Sprint Identity

- Phase: Phase 02 - Identity Core
- Sprint: Sprint 04 - User Module
- Objective: Establish `users` module as the single source of truth for identity, including identity persistence, controlled mutation, and strict boundary enforcement.
- Status: Ready for implementation
- Priority: High
- Branch: `feature/users-sprint04-core`
- Owner module: `src/modules/users`

### Task Identity

- Scope type: Sprint-level and task-level execution
- Related tasks:
  - Task 15 - User Model
  - Task 16 - User Repository
  - Task 17 - User Service
  - Task 18 - User Controller

---

## II. Objective

Implement `modules/users` as the authoritative identity owner.

Sprint 04 establishes the identity lifecycle:

- create user
- retrieve user
- update profile
- change password as a controlled mutation

Sprint 04 must enforce:

- password hashing
- email and username uniqueness
- strict module boundary separation

Strictly forbidden:

- token or JWT logic
- `auth` logic
- session management
- verification or password-reset flow
- OIDC flow
- infrastructure expansion

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

Conflict rules:

- `docs/source-of-truth-index.md` wins first.
- `docs/architecture/source-tree.md` overrides `docs/architecture/detailed-source-tree.md`.

---

## IV. Scope

Included:

- complete `users` module
- identity persistence and mutation rules
- controller-level APIs
- model, repository, service, and controller layers
- integration with existing database and crypto hash infrastructure

Excluded:

- `auth` module
- credential validation
- token or JWT logic
- OIDC flow
- session management
- verification module
- password-reset module
- infrastructure expansion
- cross-module identity storage

Required deliverables:

- `src/modules/users/user.model.ts`
- `src/modules/users/user.repository.ts`
- `src/modules/users/user.service.ts`
- `src/modules/users/user.controller.ts`

---

## V. Tasks

### Task 15 - User Model

Define a Mongoose schema for the identity record.

Required fields:

- `sub`
- `email`
- `username`
- `password_hash`
- `email_verified`

Task rules:

- enforce unique email
- enforce unique username
- store only `password_hash`
- never persist plain password
- no token, session, verification, or reset ownership

### Task 16 - User Repository

Abstract database access behind the `users` module boundary.

Required methods:

- create user
- find by id or `sub`
- find by email
- find by username
- update user

Task rules:

- no direct DB access outside repository layer
- return domain-safe objects
- do not leak database internals into other modules

### Task 17 - User Service

Implement identity lifecycle and mutation rules.

Required behavior:

- create user
- retrieve user
- update profile
- change password
- hash password before persistence
- re-hash password during password change
- reject duplicate email or username
- allow only controlled profile fields to be updated

Task rules:

- use hashing utility from `infrastructure/crypto`
- no token generation
- no session logic
- no credential validation flow
- no verification or password-reset flow

### Task 18 - User Controller

Expose user lifecycle endpoints while delegating all business behavior to `user.service.ts`.

Required endpoints:

- register user
- get user
- update profile
- change password

Task rules:

- controller logic must remain minimal
- responses must be standardized
- no business logic in controller
- no token, auth, session, verification, reset, or OIDC logic

---

## VI. Rules

Domain rules:

- `users` is the single source of truth for identity.
- password must always be stored as a hash.
- plain password persistence is forbidden.
- identity mutation must be controlled.

Boundary rules:

- no business logic in `infrastructure`
- no `auth` logic inside `users`
- no token logic
- no cross-module ownership violation
- no direct DB access outside repository layer
- no internal DB structure leakage

System rules:

- no `process.env` outside `config`
- follow `source-tree.md`
- no undocumented architecture change
- all changes must be traceable to Sprint 04
- respect governance and PR rules

---

## VII. Acceptance Criteria

Global acceptance criteria:

- user model exists and enforces schema and uniqueness
- repository implements required data access methods
- service enforces hashing and controlled mutation rules
- controller exposes required endpoints
- password is never stored in plain text
- identity lifecycle is functional
- `users` module owns identity exclusively
- no identity duplication exists
- no boundary violation is introduced
- no token, auth, session, verification, reset, or OIDC logic exists
- implementation aligns with source-of-truth

---

## VIII. Validation

Static validation:

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run format:check`
- `npm.cmd run build`

Runtime validation:

- create user -> success
- duplicate email -> fail
- duplicate username -> fail
- password stored hashed
- update profile -> controlled fields only
- change password -> password re-hashed

Manual validation:

- no plain password persistence
- no boundary violation
- correct file placement
- no token, auth, session, verification, reset, or OIDC flow logic

Suggested commands to record in the task report:

- `npm install`
- `npx tsc --noEmit`
- `npm run lint`
- `npm run format:check`
- `npm run build`
- `npm run dev`

---

## IX. Commit and PR Rules

Commit format:

- `<type>(<scope>): <message>`

Suggested commits:

- `feat(users): implement user model and schema`
- `feat(users): add repository layer for identity persistence`
- `feat(users): implement user service with hashing and mutation control`
- `feat(users): expose user controller endpoints`

PR requirements:

- must stay within Sprint 04 scope
- must include validation evidence
- must reference Phase 02 / Sprint 04 / Tasks 15-18
- must pass all quality gates
- must not introduce architecture drift
- must use the standard PR template

---

## X. Required Report Back

Dev must submit a task report including:

- task identity
- source-of-truth used
- files created or updated
- commands executed
- validation results
- scope included and excluded
- risks or limitations
- handoff note for Sprint 05

---

## XI. Completion Rule

Sprint 04 is complete only when:

- identity lifecycle is fully functional
- password handling is secure and hashed
- no identity duplication exists
- no boundary violation is detected
- all validations pass
- implementation matches source-of-truth
- task report is submitted
- PR is compliant with governance
- handoff note for Sprint 05 is provided
