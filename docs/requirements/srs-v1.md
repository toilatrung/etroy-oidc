# eTroy OIDC - Software Requirements Specification (SRS v1)

---

## I. Introduction

### 1. Purpose

This document defines the functional and non-functional requirements for eTroy OIDC.

Objectives:

- define clearly what the system must do (WHAT)
- provide a contract between Business, Development, and Testing
- serve as the basis for API design, test cases, and behavior validation

### 2. Scope

eTroy OIDC is an **OpenID Connect Provider (OP)** responsible for:

- user authentication
- identity management
- OAuth2/OIDC token issuance
- Single Sign-On (SSO)

The system serves multiple ecosystem clients:

- eTroy
- eTroy Bulletin
- Troy Course Lab

### 3. Definitions

- **OIDC**: OpenID Connect
- **OP**: OpenID Provider (eTroy OIDC)
- **Client**: application consuming OIDC
- **User**: system user identity subject
- **Token**: Access Token, ID Token, Refresh Token

---

## II. Overall Description

### 1. Product Perspective

eTroy OIDC is the central identity system:

- all clients authenticate through OIDC
- clients must not own user identity
- identity must remain authoritative in OIDC

### 2. User Classes

#### a. End User

- register account
- login
- manage selected personal profile information

#### b. Admin

- manage clients
- perform controlled user administration operations
- monitor system operations

### 3. Assumptions and Constraints

- Authorization Code Flow + PKCE is mandatory
- social login is not included in this version
- system is designed for internal ecosystem operation

---

## III. Functional Requirements

### 1. Identity Management

#### 1.1 User Registration

Users can register with:

- email
- password
- name (optional)

System must:

- enforce unique email
- hash password before persistence
- send verification email

#### 1.2 User Login

Users can login with:

- email
- password

System must:

- validate credentials
- return authentication result suitable for OIDC flow continuation

#### 1.3 Email Verification

Users must verify email before full account usage.

System must:

- send verification token by email
- validate verification token
- update `email_verified` state

#### 1.4 Password Reset

Users can reset password.

System must:

- create reset token
- send reset email
- allow password change only with valid reset token

#### 1.5 Change Password

Authenticated users can change password.

System must:

- require valid authentication controls
- enforce password policy
- update password hash
- handle session/token invalidation according to security policy

#### 1.6 Update Profile (Display Name or Username)

Users can update:

- display name

System must:

- update profile at identity source
- avoid requiring clients to store identity copies

### 2. OIDC Flow

#### 2.1 Authorization Endpoint

System must provide `/authorize` and support Authorization Code Flow + PKCE.

#### 2.2 Token Endpoint

System must provide `/token` and support authorization code exchange to tokens.

#### 2.3 Token Issuance

System must issue:

- `ID Token` (signed)
- `Access Token`
- `Refresh Token`

#### 2.4 UserInfo Endpoint

System must provide `/userinfo` and return claims according to granted scopes.

#### 2.5 Session Management

System must:

- maintain login session state
- support SSO across approved clients

#### 2.6 Logout

Users can logout, and logout must invalidate applicable session state.

### 3. Client Management

#### 3.1 Client Registration

Admin can create clients with:

- `client_id`
- `client_secret`
- `redirect_uris`

#### 3.2 Client Validation

System must:

- validate `redirect_uri`
- validate client credentials

### 4. Token Management

#### 4.1 Access Token

- used for resource access
- short-lived

#### 4.2 Refresh Token

- used to obtain new access tokens
- must be stored hashed
- must support revoke

#### 4.3 Token Revocation

System must support refresh token revocation.

### 5. Audit and Logging

System must record:

- login success/failure
- password changes
- token issuance events
- security-relevant events

---

## IV. Non-functional Requirements

### 1. Security

- passwords must be hashed
- tokens must be signed where required
- refresh tokens must never be stored raw
- PKCE is mandatory
- CSRF protection must be applied where relevant

### 2. Performance

- authorization flow should respond in under 500 ms (excluding external latency)
- token issuance must remain fast and operationally stateless at request level

### 3. Scalability

- architecture must support multi-client growth
- client applications must not become identity state owners

### 4. Maintainability

- implementation must respect module boundaries
- no duplicate ownership logic across modules
- logging and audit traces must be clear and actionable

### 5. Reliability

- avoid unexpected session loss
- maintain consistent token lifecycle behavior

---

## V. Out of Scope

- social login
- MFA
- external identity federation
- advanced admin dashboard

---

## VI. Acceptance Criteria

System is acceptable when:

- users can register, login, verify email, reset password, change password, and update profile
- OIDC flow works end-to-end: authorize -> token -> userinfo
- tokens are issued and validated correctly, including refresh flow
- no violations exist for module boundaries, data ownership, or security rules

---

## VII. Traceability

| Feature | Module |
|---|---|
| Registration | `auth` + `users` |
| Login | `auth` |
| Email verification | `verification` |
| Password reset | `password-reset` |
| Change password | `auth` + `users` |
| Profile update | `users` |
| OIDC flow | `oidc` |
| Token lifecycle | `oidc` |
| Client management | `admin` + `oidc` |
| Audit | `audit` |

---

## VIII. Conclusion

SRS v1 defines:

- required system behavior
- scope boundaries
- acceptance standards

This document is not implementation design. It is a contract for:

- API design alignment
- test design and validation
- behavior verification against agreed requirements
