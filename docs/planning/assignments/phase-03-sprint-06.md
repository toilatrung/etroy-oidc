# Phase 03 - Sprint 06 - Verification Module

## I. Assignment Identity

- Phase: Phase 03 - Account Lifecycle
- Sprint: Sprint 06 - Verification Module
- Scope Type: sprint-level
- Execution Level: production-ready baseline
- Owner Module: src/modules/verification
- Shared Module: src/modules/token-lifecycle

---

## II. Objective

Implement email verification lifecycle with unified token layer:

- generate verification token
- send verification email
- validate token
- mark email as verified

---

## III. Scope

### Included

- token-lifecycle foundation (shared)
- verification flow:
  - request verification
  - confirm verification
- email delivery integration

### Excluded

- password reset flow
- OIDC token logic
- session management
- auth module changes

---

## IV. Task Breakdown

### Task 22 - Token Model (shared)

- define token schema
- fields:
  - userId
  - purpose = email_verification
  - tokenHash
  - expiresAt
  - usedAt

---

### Task 23 - Token Service

- generateToken(userId, purpose)
- validateToken(rawToken, purpose)
- consumeToken(tokenId)

---

### Task 24 - Verification Service

- requestVerification(userId)
  - generate token
  - send email

- verifyEmail(token)
  - validate token
  - update email_verified via users service
  - consume token

---

### Task 25 - Verification Controller

Endpoints:

- POST /verification/request
- POST /verification/confirm

Rules:

- controller must remain thin
- delegate to service layer only

---

### Task 26 - Mail Integration

- use infrastructure/mail
- send verification link
- include raw token (NOT hash)

---

## V. Deliverables

- src/modules/token-lifecycle/*
- src/modules/verification/*

---

## VI. Allowed Dependencies

- users service (identity update)
- infrastructure/crypto
- infrastructure/mail
- infrastructure/database

---

## VII. Forbidden Dependencies

- auth module
- OIDC module
- direct DB access outside repository
- process.env usage

---

## VIII. Security-Critical Rules

- never store raw token
- token must be hashed
- token must expire
- token must be one-time use
- no logging of token or sensitive data

---

## IX. Validation Commands

- npm run lint
- npm run typecheck
- npm run format:check
- npm run build

---

## X. Manual Validation

- valid token → email_verified = true
- expired token → rejected
- reused token → rejected
- token stored hashed
- verification does not bypass users service

---

## XI. Definition of Done

- verification flow works end-to-end
- token lifecycle enforced
- no boundary violations
- no OIDC logic introduced

---

## XII. Handoff

- token-lifecycle is stable and reusable
- ready for Sprint 07 (password-reset reuse)
