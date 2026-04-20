# Phase 02 - Identity Core

---

## I. Overview

### Objective

Implement the core identity domain under strict single-source-of-truth principles:

- establish user identity ownership in `users`
- implement credential validation in `auth`
- enforce identity integrity and mutation rules

This phase delivers the identity foundation required for downstream lifecycle and OIDC flows.

### Separation from Phase 01

- Phase 01: infrastructure and runtime baseline
- Phase 02: first domain implementation for Identity Core

No infrastructure expansion is allowed unless explicitly approved.

### Out of Scope

- email verification
- password reset
- token lifecycle
- OIDC protocol flow
- session management

---

## II. Sprint Breakdown

| Sprint | Scope |
| --- | --- |
| Sprint 04 | User Module |
| Sprint 05 | Auth Module |

---

## III. Sprint Definitions

### Sprint 04 - User Module

Goal:

- establish `users` as the authoritative identity owner

Scope:

- user identity model
- identity persistence
- identity creation and retrieval
- email and username uniqueness
- profile update
- password change as a controlled identity mutation
- controller-level APIs for user lifecycle operations

Contracts:

- `users` is the only source of truth for identity
- password must always be stored hashed
- email and username uniqueness must be enforced by `users`
- identity mutations must be controlled and validated
- no other module may store or duplicate identity data
- password change must use a controlled identity update flow
- Sprint 04 must not introduce `auth`, token, session, verification, password-reset, or OIDC flow logic

Required deliverables:

- `src/modules/users/user.model.ts`
- `src/modules/users/user.repository.ts`
- `src/modules/users/user.service.ts`
- `src/modules/users/user.controller.ts`

Task range:

- Task 15 - User Model
- Task 16 - User Repository
- Task 17 - User Service
- Task 18 - User Controller

### Sprint 05 - Auth Module

Goal:

- provide credential validation separated from identity ownership

Scope:

- login credential validation
- password comparison
- authentication result signaling

Contracts:

- `auth` validates credentials only
- `auth` does not generate tokens
- `auth` does not own identity data
- authentication result must reference a valid identity from `users`
- no session or token lifecycle is introduced

---

## IV. Domain Scope

### `modules/users`

Responsibilities:

- own identity data and persistence
- create user identity records
- retrieve identity records
- enforce email and username uniqueness
- update profile fields
- change password through hashed password persistence
- expose user lifecycle controller endpoints through the delivery layer

Must not:

- validate login credentials
- generate tokens
- implement verification or reset flows
- implement session or OIDC protocol behavior

### `modules/auth`

Responsibilities:

- validate login credentials
- compare password against stored hash

Must:

- depend on `users` for identity lookup

Must not:

- generate tokens
- mutate identity
- store identity data

### `modules/verification`

- not in scope for Phase 02
- must not be implemented beyond explicit placeholders if required

### `modules/password-reset`

- not in scope for Phase 02
- must not be implemented beyond explicit placeholders if required

---

## V. Integration Constraints

Allowed:

- `auth` retrieves user identity through approved `users` contracts
- `auth` verifies passwords using approved hashing utilities

Forbidden:

- `auth` mutates user data
- `auth` stores identity independently
- `auth` generates any token
- `verification` or `password-reset` interacts with `users` during Phase 02
- OIDC flow logic appears in Phase 02

---

## VI. Definition of Done

Phase 02 is complete when:

- user identity lifecycle is functional:
  - create user
  - retrieve user
  - update profile
  - change password
- user lifecycle controller endpoints are available for Sprint 04 scope
- email and username uniqueness are enforced
- credential validation works through `auth`
- `users` remains the only identity source
- `auth` does not generate tokens
- no identity duplication exists
- no boundary violations exist
- verification and password-reset flows are not implemented prematurely
- startup, configuration, typecheck, build, and relevant validation evidence are available

---

## VII. Enforcement Rules

- no `process.env` outside `config`
- no business logic in `infrastructure`
- no cross-module ownership violation
- no token logic in this phase
- no lifecycle flow leakage from Phase 03
- no OIDC logic introduced
- contract-first implementation is mandatory

---

## VIII. Output

Phase 02 produces:

- stable identity domain through `users`
- credential validation pipeline through `auth`
- controlled identity mutation for profile and password changes

This becomes the input for Phase 03, where verification and password reset flows are introduced.
