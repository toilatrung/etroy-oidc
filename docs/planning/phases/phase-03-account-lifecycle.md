# Phase 03 - Account Lifecycle

---

## I. Overview

### Objective

Complete account lifecycle flows for identity self-service while preserving the separation between identity lifecycle tokens and OIDC protocol tokens.

Phase 03 introduces:

- email verification
- password reset
- a unified token lifecycle layer for non-OIDC identity lifecycle flows

### Scope

- email verification flow
- password reset flow
- shared `token-lifecycle` module
- token generation and validation for:
  - `email_verification`
  - `password_reset`

### Explicit Separation

Phase 03 token lifecycle is:

- NOT OIDC token logic
- NOT JWT issuance
- NOT access token, refresh token, or ID token handling
- NOT session logic
- strictly for identity lifecycle flows

OIDC token issuance and OIDC session management remain out of scope for this phase.

---

## II. Sprint Breakdown

| Sprint    | Scope                 |
| --------- | --------------------- |
| Sprint 06 | Verification Module   |
| Sprint 07 | Password Reset Module |

---

## III. Sprint Definitions

### Sprint 06 - Verification Module

Goal:

- implement email verification using the shared non-OIDC token lifecycle layer

Scope:

- verification request workflow
- verification email coordination through approved mail abstraction
- verification token creation through `token-lifecycle`
- verification token validation through `token-lifecycle`
- `email_verified` update through approved `users` contracts

Contracts:

- `verification` owns the email verification business flow
- `verification` does not persist raw tokens
- `verification` does not implement password reset behavior
- `verification` does not issue OIDC tokens or manage sessions
- only `users` may mutate the user identity record
- verification link format: `/verify-email?token=<rawToken>`
- verification link base URL source: config `APP_BASE_URL`
- raw token is transported in URL query for verification
- `tokenHash` is never exposed
- token is one-time use
- token expiration is enforced by `token-lifecycle`

### Sprint 07 - Password Reset Module

Goal:

- implement password reset using the shared non-OIDC token lifecycle layer

Scope:

- password reset request workflow
- reset email coordination through approved mail abstraction
- reset token creation through `token-lifecycle`
- reset token validation through `token-lifecycle`
- password update coordination through approved `users`/`auth` contracts

Contracts:

- `password-reset` owns the password reset business flow
- `password-reset` does not persist raw tokens
- `password-reset` does not implement email verification behavior
- `password-reset` does not issue OIDC tokens or manage sessions
- only `users` may mutate the user identity record

---

## IV. Domain Ownership Rules

### `modules/users`

Responsibilities:

- remain the only owner of user identity data
- perform identity mutations through approved contracts
- control updates to `email_verified`
- control password hash persistence

Must not:

- generate lifecycle tokens
- store lifecycle tokens
- own verification or password reset workflows
- issue OIDC tokens

### `modules/verification`

Responsibilities:

- own the email verification business flow
- request and verify `email_verification` tokens through `token-lifecycle`
- coordinate email delivery through infrastructure mail abstraction
- coordinate identity mutation through `users`

Must not:

- mutate identity directly outside `users` contracts
- store raw tokens
- implement password reset
- issue OIDC tokens or manage sessions

### `modules/password-reset`

Responsibilities:

- own the password reset business flow
- request and verify `password_reset` tokens through `token-lifecycle`
- coordinate reset email delivery through infrastructure mail abstraction
- coordinate password updates through approved `users`/`auth` contracts

Must not:

- mutate identity directly outside approved identity contracts
- store raw tokens
- implement email verification
- issue OIDC tokens or manage sessions

### `modules/token-lifecycle`

Responsibilities:

- generate high-entropy lifecycle tokens
- persist token hashes only
- verify tokens through hash comparison
- enforce expiration
- enforce one-time usage
- enforce revocation
- support token purposes:
  - `email_verification`
  - `password_reset`

Must not:

- implement verification or password reset business flows
- mutate user identity directly
- access user data beyond an identity ID reference
- issue JWTs
- issue OIDC tokens
- manage sessions

---

## V. Token Lifecycle Rules

Mandatory token rules:

- lifecycle tokens must be generated with high entropy
- raw lifecycle tokens must never be persisted
- persisted token data must use hashed storage
- token verification must compare against the stored hash
- tokens must expire
- tokens must be one-time use
- tokens must support revocation
- token records must be scoped to an explicit purpose

Supported purposes:

- `email_verification`
- `password_reset`

Forbidden:

- reusing OIDC access token, refresh token, or ID token logic
- issuing JWTs for lifecycle tokens
- storing raw tokens
- using lifecycle tokens as sessions

---

## VI. Integration Constraints

Allowed:

- `verification` depends on `token-lifecycle`
- `verification` depends on `users` through approved contracts
- `password-reset` depends on `token-lifecycle`
- `password-reset` depends on `users`/`auth` through approved contracts
- `token-lifecycle` may store token records with an identity ID reference

Forbidden:

- `token-lifecycle` mutates identity
- `verification` or `password-reset` bypasses `users` ownership
- `verification` owns password reset behavior
- `password-reset` owns verification behavior
- introducing OIDC token issuance in Phase 03
- introducing session management in Phase 03
- Phase 03 changes Phase 01 or Phase 02 behavior outside approved contracts

---

## VII. Definition of Done

Phase 03 is complete when:

- email verification flow is functional
- password reset flow is functional
- shared lifecycle token generation is enforced
- lifecycle tokens are stored hashed only
- lifecycle tokens expire
- lifecycle tokens are one-time use
- lifecycle tokens can be revoked
- `email_verification` and `password_reset` purposes are supported
- only `users` mutates identity data
- `token-lifecycle` does not mutate identity
- no OIDC token logic is introduced
- no session logic is introduced
- no module boundary violations exist

---

## VIII. Enforcement Rules

- preserve `users` as the only identity owner
- keep token lifecycle separate from OIDC token issuance
- keep lifecycle tokens separate from sessions
- do not store raw tokens
- do not duplicate token lifecycle logic inside verification or password reset modules
- do not introduce new root folders or infrastructure
- follow `module-boundaries.md` and `source-tree.md`

---

## IX. Output

Phase 03 produces:

- email verification account lifecycle flow
- password reset account lifecycle flow
- unified non-OIDC token lifecycle layer for identity lifecycle tokens

This becomes input for later OIDC phases without changing OIDC token issuance or session ownership.
