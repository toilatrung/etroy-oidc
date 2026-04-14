# eTroy OIDC — Module Boundaries

---

## I. Purpose

This document defines module boundaries for the eTroy OIDC system to ensure:

- architecture is implemented according to the approved source of truth
- domain isolation is enforced across modules
- duplicate business logic and architecture drift are prevented
- code review and PR validation use clear, enforceable criteria

This document is an **architecture enforcement contract** between design and implementation.  
If implementation conflicts with this contract, implementation is non-compliant.

---

## II. Architectural Context

eTroy OIDC follows:

- Modular Monolith
- Domain-based Architecture

Main source areas:

- `app` → delivery layer
- `config` → configuration abstraction
- `modules` → domain and application logic
- `infrastructure` → external systems
- `shared` → cross-cutting concerns
- `jobs` → background processing

This boundary contract is aligned with `system-overview.md`, `source-tree.md`, `srs-v1.md`, and `master-execution-plan.md`.

---

## III. Boundary Enforcement Principles

### 1. Single Ownership

Each domain object must have exactly one primary owning module.  
Other modules may access that object only through approved service/repository contracts.

### 2. No Hidden Coupling

The following are forbidden:

- arbitrary cross-module imports
- direct use of another module's internal model without explicit contract
- re-implementing logic that belongs to another module

### 3. No Direct External Access from Arbitrary Modules

Business modules must not directly call low-level platform libraries when an approved abstraction exists in `infrastructure`.

Examples:

- email sending must go through `infrastructure/mail`
- crypto/token utilities must go through `infrastructure/crypto`
- logging must go through `infrastructure/logger`

### 4. Contract-first Dependency

A module may depend on another module only when:

- there is a clear architectural reason
- ownership boundaries are preserved
- dependency does not create circular responsibility

---

## IV. Module Responsibility Matrix

### 1. `modules/users`

Primary role:

- single source of truth for user identity
- owner of user entity lifecycle and core identity fields

Allowed:

- create/read/update user data
- manage identity attributes (`sub`, `email`, `password_hash`, `name`, `avatar_url`, `email_verified`, `status`)
- enforce identity-related user policies

Forbidden:

- token generation
- OIDC flow ownership
- client management logic

Ownership:

- user identity record
- user profile core data
- user status

### 2. `modules/auth`

Primary role:

- local credential validation
- register/login orchestration for local identity authentication

Allowed:

- validate credential input and policy
- create users via `users` contracts
- verify current credential
- support OIDC interaction at credential-validation level only

Forbidden:

- access token generation
- refresh token generation
- ID token generation
- OIDC protocol ownership
- direct token-store ownership

Mandatory rule:

- `auth` authenticates local identity only; token issuance belongs to `oidc`

Ownership:

- local register/login use cases
- credential verification workflow

### 3. `modules/verification`

Primary role:

- email verification lifecycle

Allowed:

- create verification token
- send verification email through mail abstraction
- verify token
- mark `email_verified`

Forbidden:

- token issuance
- password-reset ownership
- bypassing `users` ownership for identity updates

Ownership:

- verification token
- verification state

### 4. `modules/password-reset`

Primary role:

- password reset lifecycle

Allowed:

- create reset token
- send reset email
- validate reset token
- coordinate password change via `users`/`auth` contracts

Forbidden:

- login token issuance
- OIDC authorization ownership
- OIDC session ownership
- bypassing password policy

Ownership:

- reset token
- reset workflow state

### 5. `modules/oidc`

Primary role:

- core OpenID Connect domain
- authorization/token/claims/client/session orchestration

Allowed:

- run OIDC provider
- handle `/authorize`, `/token`, `/userinfo`, consent, interactions, logout
- issue ID token, access token, refresh token
- handle claims mapping
- manage OIDC client metadata
- manage OIDC session lifecycle
- perform revoke/rotation/introspection

Forbidden:

- direct ownership queries to user DB bypassing `users`
- owning user identity lifecycle
- replacing `auth` credential validation
- duplicating verification/password-reset ownership

Mandatory rules:

- OIDC may use user data but must not break `users` ownership
- OIDC must not become a god module that absorbs all identity/auth responsibilities

Ownership:

- OIDC protocol flow
- token lifecycle
- claims
- client metadata
- OIDC session

### 6. `modules/admin`

Primary role:

- system administration orchestration

Allowed:

- orchestrate admin use cases
- call `users`, `oidc`, and `audit` through approved contracts
- handle disable user, create client, rotate client secret workflows

Forbidden:

- direct cross-domain DB mutation
- direct token issuance implementation
- raw infrastructure mutation without service contract

Ownership:

- administrative orchestration
- admin-facing control flows

### 7. `modules/audit`

Primary role:

- security and audit event recording

Allowed:

- persist audit logs
- provide query/record interfaces for system events

Forbidden:

- mutating business state on behalf of domain modules
- becoming a primary business logic module

Ownership:

- audit records
- audit event persistence

### 8. `modules/health`

Primary role:

- health/readiness reporting

Allowed:

- report service health
- check dependency readiness

Forbidden:

- business logic ownership
- intervention in OIDC or identity domain flows

---

## V. Allowed Dependency Matrix

### 1. Allowed

- `auth` → `users`
- `verification` → `users`
- `password-reset` → `users`
- `oidc` → `users` (through approved service/account contract)
- `oidc` → `auth` (credential validation support only)
- `admin` → `users`
- `admin` → `oidc`
- `admin` → `audit`
- `health` → `infrastructure`
- all modules → `shared`
- all modules → `infrastructure` (through approved abstractions)

### 2. Conditionally Allowed

Only allowed with explicit contract and no ownership violation:

- `auth` → `verification`
- `users` → `shared`
- `oidc` → `audit`
- `verification` → `audit`
- `password-reset` → `audit`

### 3. Forbidden

- `oidc` → direct user DB ownership queries
- `auth` → token generation
- `auth` → session issuance
- `users` → OIDC protocol ownership
- `client application` → local user identity as primary source
- `admin` → direct raw cross-domain mutation without service contract
- `verification` → password-reset ownership
- `password-reset` → verification ownership

---

## VI. Data Ownership Rules

### 1. User Data

Owner: `modules/users`

Includes:

- `sub`
- `email`
- `password_hash`
- `name`
- `avatar_url`
- `email_verified`
- `status`

All other modules must consume user data through approved `users` contracts.

### 2. Credential Validation

Owner: `modules/auth`

Includes:

- login credential verification
- current password re-check
- register credential rules at flow level

### 3. Verification Data

Owner: `modules/verification`

Includes:

- verification token
- verification state

### 4. Password Reset Data

Owner: `modules/password-reset`

Includes:

- reset token
- reset expiry
- reset workflow state

### 5. Token Data

Owner: `modules/oidc`

Includes:

- access token lifecycle
- refresh token lifecycle
- revoke/rotation/introspection
- ID token issuance

Mandatory security rule:

- refresh tokens must be hashed before persistence; raw refresh tokens must not be stored

### 6. Session Data

Owner: `modules/oidc`  
Storage abstraction: `infrastructure/redis`

### 7. Client Metadata

Owner: `modules/oidc/clients`, or admin orchestration through `modules/admin` into `oidc`

Includes:

- `client_id`
- `client_secret`
- `redirect_uris`
- `scopes`

---

## VII. Layer Boundaries

### 1. `app`

Role:

- request/response handling
- routing
- middleware
- controller entry points

Forbidden:

- core business logic
- token lifecycle logic
- direct DB mutations instead of module/service contracts

### 2. `config`

Role:

- read and normalize system configuration
- encapsulate `process.env`

Forbidden:

- business logic
- bypassing configuration boundary with direct `process.env` access outside `config`

### 3. `infrastructure`

Role:

- adapters to external systems
- database, Redis, mail, logging, crypto, metrics integrations

Forbidden:

- domain business orchestration
- domain policy logic that belongs in modules

### 4. `shared`

Role:

- cross-cutting primitives
- constants, generic types, generic errors, generic utilities, validators

Forbidden:

- hidden domain logic
- module-specific workflows
- becoming a dumping ground for unrelated code

### 5. `jobs`

Role:

- cleanup
- rotation
- scheduled operational tasks

Forbidden:

- replacing business services
- bypassing module ownership
- mutating domain state outside approved contracts

---

## VIII. Violation Examples

### 1. Auth generates token

```ts
// forbidden: token generation inside auth module
const accessToken = signAccessToken(user);
```

### 2. OIDC directly queries user DB

```ts
// forbidden: oidc bypasses users ownership
const user = await UserModel.findById(sub);
```

### 3. Client stores user identity as primary source

```ts
// forbidden: client application treats local storage as source of truth
localStore.users[user.sub] = user;
```

### 4. Shared contains domain logic

```ts
// forbidden: domain policy implemented in shared layer
export function issueRefreshTokenForAuthFlow(userId: string) {
  // domain workflow logic should not live in shared
}
```

---

## IX. PR Review Checklist

Use this checklist for architecture contract validation:

- module ownership is explicit and not duplicated
- no forbidden dependency from Section V
- `auth` does not generate tokens
- `oidc` does not bypass `users` ownership for user data
- refresh token persistence is hashed only
- no business policy leaked into `infrastructure` or `shared`
- layer responsibilities from Section VII are respected
- file placement aligns with `source-tree.md`

PRs failing these checks must not be approved.

---

## X. Change Control

Boundary changes require explicit architecture governance:

1. propose boundary change with rationale and impact
2. align with `system-overview.md` and `source-tree.md`
3. update this document before or with implementation
4. validate dependency and ownership impact in PR review
5. merge only after architecture compliance is re-established

No ad-hoc boundary changes are allowed.

---

## XI. Conclusion

`module-boundaries.md` enforces architecture correctness by separating:

- module responsibilities
- allowed and forbidden dependencies
- data ownership
- layer responsibilities

By enforcing these boundaries, eTroy OIDC prevents architecture drift, preserves domain integrity, and keeps implementation consistent with approved system contracts.
