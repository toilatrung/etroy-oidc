# eTroy OIDC - System Overview

---

## I. System Context

eTroy OIDC is an **OpenID Connect Provider (OP)** that serves as the central **Identity Layer** for the eTroy ecosystem.

The system is responsible for:

- user authentication
- identity management
- token issuance (`ID Token`, `Access Token`, `Refresh Token`)
- Single Sign-On (SSO) support
- client (relying party) management
- controlled self-service updates for core identity profile fields

eTroy OIDC does not contain client application business logic. It provides a standardized identity platform for the ecosystem.

---

## II. System Positioning in the Ecosystem

The ecosystem is separated into two layers:

### 1. Identity Layer

- eTroy OIDC (OpenID Provider)
- single source of truth for user identity

### 2. Application Layer

Applications that consume identity from OIDC:

- eTroy (core system)
- eTroy Bulletin
- Troy Course Lab

Principles:

- clients do not authenticate users directly
- clients do not own identity records
- clients validate tokens and consume identity claims

---

## III. Architectural Principles (Non-negotiable)

### 1. Identity = Single Source of Truth

- only eTroy OIDC owns user identity
- no identity duplication in clients
- identity updates must go through the Identity Layer

### 2. Domain Isolation

- Auth is not OIDC
- User is not Token
- Client is not Identity

Each domain has clear boundaries and must not absorb another domain's ownership.

### 3. OIDC Is Core

- mandatory `Authorization Code Flow + PKCE`
- `ID Token` must be RSA-signed
- `Refresh Token` must be hashed before persistence

### 4. Contract-first Architecture

- API, claims, and flow contracts must be defined first
- no implementation without approved contract

### 5. Security-first Design

- no raw token persistence
- token validation must include signature verification
- CSRF protection is mandatory where applicable
- replay and code interception controls are mandatory
- sensitive identity changes require appropriate authentication controls

---

## IV. High-level Architecture

The system is designed as:

- **Modular Monolith**
- **Domain-based Architecture**

Primary layers:

- `app` - delivery layer (HTTP, middleware, routing)
- `config` - configuration abstraction
- `modules` - domain and application logic
- `infrastructure` - external system integration
- `shared` - cross-cutting concerns
- `jobs` - scheduled and background tasks

Principles:

- modules should not call low-level external libraries directly when abstraction exists
- layer boundaries must not be bypassed

---

## V. Domain Decomposition

### 1. Identity Domain

- `users`
- `auth`
- `verification`
- `password-reset`
- profile update use cases

This domain owns user lifecycle and core identity mutations.

### 2. OIDC Domain (Core)

- provider
- claims
- clients
- tokens
- sessions

This domain owns OIDC protocol flow and token/session lifecycle.

### 3. Infrastructure Domain

- database (MongoDB)
- Redis (session, cache)
- mail (email delivery)
- logger (application and audit logging)
- crypto (hashing, key handling)

---

## VI. Core Capabilities

### 1. Identity Capabilities

- user registration
- user login
- email verification
- password reset
- password change
- display-name update

### 2. OIDC Capabilities

- Authorization Code Flow + PKCE
- ID Token issuance
- Access Token issuance
- Refresh Token issuance
- UserInfo endpoint
- session-based SSO

### 3. Administrative and Platform Capabilities

- client management
- token/session control
- audit-ready operational foundation

---

## VII. Core Flows (Conceptual)

### 1. Authentication and Authorization Flow

User -> Client  
-> redirect -> `/authorize`  
-> credential authentication (`auth`)  
-> authorization code  
-> client calls `/token`  
-> receives `ID Token` + `Access Token` (+ optional `Refresh Token`)  
-> token validation  
-> authenticated client session

### 2. Token Lifecycle

- `Access Token`: short-lived
- `ID Token`: signed (RSA)
- `Refresh Token`:
  - stored hashed
  - supports rotation
  - revocable

### 3. SSO Flow

- OIDC-managed session (cookie-based)
- one user session can be reused across multiple clients
- logout invalidates relevant session state

### 4. Identity Update Flow

#### a. Change Password

User  
-> authenticated current session  
-> password change request  
-> current credential and password policy validation  
-> password hash update  
-> audit event recording  
-> session/token handling according to security policy

#### b. Change Display Name or Username

User  
-> authenticated current session  
-> profile update request  
-> uniqueness and naming policy validation  
-> identity record update in OIDC  
-> clients consume updated identity from OIDC rather than storing local identity copies

---

## VIII. Technology Strategy

### Backend

- Node.js
- Express
- TypeScript
- `oidc-provider` as OIDC core

### Data Layer

- MongoDB for identity data
- Redis for session and cache data

### Security

- Argon2 for password hashing
- JWT for token format
- PKCE for authorization code interception defense
- RSA for token signing

### Infrastructure

- Nodemailer for email delivery
- Pino for logging
- Zod for validation

---

## IX. Out of Scope (Current Phase)

- social login (Google, Facebook, and similar)
- multi-factor authentication (MFA)
- advanced admin dashboard
- external identity federation

---

## X. Key Architectural Risks

### 1. Boundary Violation

- `auth` generates tokens
- `oidc` directly queries ownership data from user database

### 2. Identity Duplication

- clients store user identity as primary data
- clients mutate profile ownership logic locally

### 3. Token Security Risk

- raw refresh token persistence
- no token rotation
- no revoke mechanism

### 4. Unsafe Identity Mutation

- password change without re-authentication controls
- identity updates without appropriate policy enforcement
- missing audit trail for sensitive identity changes

### 5. Architectural Drift

- contract-first governance not enforced
- cross-domain dependency drift

---

## XI. Conclusion

eTroy OIDC is the identity foundation for the eTroy ecosystem.

When implemented correctly:

- SSO is reliable
- identity remains consistent
- multi-client scaling is supported
- users can self-manage selected core identity attributes in one authoritative source

When implemented incorrectly:

- identity consistency degrades
- security risk increases
- ecosystem scaling becomes unstable
