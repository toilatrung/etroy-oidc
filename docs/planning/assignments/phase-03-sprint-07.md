# Phase 03 - Sprint 07 - Password Reset Module

## I. Assignment Identity

- Phase: Phase 03 - Account Lifecycle
- Sprint: Sprint 07 - Password Reset Module
- Scope Type: sprint-level
- Execution Level: production-ready baseline
- Owner Module: src/modules/password-reset
- Shared Module: src/modules/token-lifecycle

---

## II. Objective

Implement secure password reset lifecycle using unified token layer:

- request password reset
- send reset email
- validate reset token
- update password securely

---

## III. Scope

### Included

- password reset flow:
  - request reset
  - confirm reset
- reuse token-lifecycle
- password update via users module

### Excluded

- email verification flow
- OIDC logic
- session handling
- login/auth changes

---

## IV. Task Breakdown

### Task 27 - Token Layer Integration

- reuse token-lifecycle
- purpose = password_reset

Constraints:

- must NOT duplicate token logic
- must NOT create separate token system

---

### Task 28 - Password Reset Service

#### requestReset(email)

- lookup user (via users service)
- IF user exists:
  - generate token
  - send email
- ALWAYS return success response

→ prevent email enumeration

---

#### confirmReset(token, newPassword)

- validate token
- update password via users service
- consume token

---

### Task 29 - Password Reset Controller

Endpoints:

- POST /password-reset/request
- POST /password-reset/confirm

Rules:

- no business logic in controller
- response must be generic for request endpoint

---

### Task 30 - Password Update Flow

- password hashing via crypto layer
- update through users service ONLY

Constraints:

- no direct DB write
- no plain password storage
- must invalidate token after use

---

## V. Deliverables

- src/modules/password-reset/*

---

## VI. Allowed Dependencies

- token-lifecycle
- users service
- infrastructure/crypto
- infrastructure/mail

---

## VII. Forbidden Dependencies

- auth module
- OIDC module
- direct DB access
- process.env outside config

---

## VIII. Security-Critical Rules

- no email enumeration
- no raw token storage
- password must be hashed
- token must be one-time use
- token must expire
- no logging of sensitive data

---

## IX. Validation Commands

- npm run lint
- npm run typecheck
- npm run format:check
- npm run build

---

## X. Manual Validation

- valid token → password updated
- expired token → rejected
- reused token → rejected
- password stored hashed
- request endpoint always returns success
- token stored hashed
- no identity mutation outside users module

---

## XI. Definition of Done

- reset flow works end-to-end
- anti-enumeration enforced
- token lifecycle reused correctly
- no duplicated token logic
- no boundary violations

---

## XII. Handoff

- password reset is fully independent from verification
- both flows share token layer safely
- ready for next phase (OIDC flows)
