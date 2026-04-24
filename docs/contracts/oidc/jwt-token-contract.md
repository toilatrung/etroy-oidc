# eTroy OIDC - JWT Token Contract

## I. Purpose

This contract defines the approved JWT token behavior for Phase 04 / Sprint 10.

It governs:

- JWT access_token formalization
- ID Token issuance
- claims mapping
- UserInfo claim output
- signing and JWKS usage
- boundary rules between oidc, users, and auth

This contract must be approved before Sprint 10 implementation starts.

---

## II. Authority

This contract is subordinate to:

- docs/source-of-truth-index.md
- docs/architecture/system-overview.md
- docs/architecture/module-boundaries.md
- docs/architecture/source-tree.md
- docs/requirements/srs-v1.md
- docs/planning/master-execution-plan.md
- docs/planning/phases/phase-04-oidc-core.md

If this contract conflicts with architecture or requirements documents, the higher-authority document wins.

---

## III. Sprint Scope

### Included in Sprint 10

- JWT access_token formalization
- ID Token issuance
- claims mapping
- scope-based claim output
- `/userinfo` baseline
- RSA signing through approved crypto/JWKS infrastructure
- token response update for client-usable OIDC baseline

### Excluded from Sprint 10

- refresh token lifecycle
- refresh token rotation
- revoke endpoint
- introspection endpoint
- session management
- SSO behavior
- logout hardening
- Phase 03 token-lifecycle reuse
- direct user DB access from oidc

These remain Phase 05 or other approved future scope.

---

## IV. JWT Access Token Contract

### Token Type

The Sprint 10 access_token MUST be a signed JWT.

Required response field:

```json
{
  "access_token": "<signed-jwt>",
  "token_type": "Bearer",
  "expires_in": 900
}
```

### Header

JWT header MUST include:

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "<active-key-id>"
}
```

### Rules

- alg MUST be RS256
- kid MUST reference an active JWKS key
- `alg: none` is forbidden
- symmetric signing is forbidden

---

## V. Access Token Claims

### Required claims

```json
{
  "iss": "<issuer-url>",
  "sub": "<user-sub>",
  "aud": "<client-id>",
  "iat": 1710000000,
  "exp": 1710000900,
  "scope": "openid profile email"
}
```

### Claim Rules

- iss MUST come from normalized config
- sub MUST come from approved users identity contract
- aud MUST equal the validated client_id
- iat MUST be generated at issuance time
- exp MUST be derived from configured access token TTL
- scope MUST reflect approved and granted scopes
- raw user persistence fields MUST NOT be projected directly

Optional future claims require explicit contract update.

---

## VI. ID Token Contract

Sprint 10 MUST issue ID Token for OIDC authorization-code exchange.

### Required response field

```json
{
  "id_token": "<signed-jwt>"
}
```

### ID Token Header

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "<active-key-id>"
}
```

### Required ID Token Claims

```json
{
  "iss": "<issuer-url>",
  "sub": "<user-sub>",
  "aud": "<client-id>",
  "iat": 1710000000,
  "exp": 1710000900
}
```

### Optional Scope-Based Claims

If `email` scope is granted:

```json
{
  "email": "user@example.com",
  "email_verified": true
}
```

If `profile` scope is granted:

```json
{
  "name": "User Name",
  "picture": "https://example.com/avatar.png"
}
```

### Rules

- ID Token claims MUST be produced through claims.mapper
- ID Token MUST NOT include password_hash
- ID Token MUST NOT include internal database IDs unless explicitly approved
- ID Token MUST NOT include refresh-token or session state

---

## VII. Claims Mapper Contract

All user-facing OIDC claims MUST pass through:

```
src/modules/oidc/claims.mapper.ts
```

The mapper owns translation from approved user identity DTO to OIDC claims.

### Input

```ts
type OidcUserIdentity = {
  sub: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  avatarUrl?: string;
};
```

### Output

```ts
type OidcClaims = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};
```

### Rules

- oidc MUST NOT query UserModel directly
- oidc MUST NOT import user.repository directly
- users remains the identity source of truth
- claims.mapper MUST NOT mutate identity data
- claims.mapper MUST NOT contain token signing logic

---

## VIII. UserInfo Contract

Sprint 10 MUST implement baseline:

```
GET /userinfo
```

### Authorization

```http
Authorization: Bearer <access_token>
```

### Behavior

- validate access_token signature
- validate exp
- validate issuer
- validate audience/client relationship where applicable
- resolve mapped claims
- return claims based on granted scope

### Response Example

For `openid email profile`:

```json
{
  "sub": "user-sub",
  "email": "user@example.com",
  "email_verified": true,
  "name": "User Name",
  "picture": "https://example.com/avatar.png"
}
```

For `openid` only:

```json
{
  "sub": "user-sub"
}
```

### Rules

- /userinfo MUST NOT expose raw persistence fields
- /userinfo MUST NOT query user DB directly
- /userinfo MUST use approved users contract and claims.mapper
- /userinfo MUST NOT implement session or refresh-token behavior

---

## IX. Signing and JWKS Rules

Signing MUST use existing infrastructure crypto/JWKS utilities.

### Required behavior

- use RSA private key for signing
- expose public verification material through JWKS
- include kid in signed JWT header
- reject missing or unsupported key configuration at startup or issuance boundary

### Forbidden

- hardcoded private keys
- plain secret signing for JWT access_token or ID Token
- token signing in auth
- signing inside controller layer
- signing through ad-hoc utilities outside approved infrastructure

---

## X. TTL Rules

Default TTLs:

```
access_token: 15 minutes
id_token: 15 minutes
```

### Rules

- expires_in MUST match access_token TTL in seconds
- exp MUST match iat + TTL
- TTL values must be centralized through config if configurable
- Sprint 10 MUST NOT implement refresh-based renewal

---

## XI. Token Response Contract

Sprint 10 token response MUST include:

```json
{
  "access_token": "<jwt-access-token>",
  "token_type": "Bearer",
  "expires_in": 900,
  "id_token": "<jwt-id-token>"
}
```

### Rules

- refresh_token MUST NOT be returned in Sprint 10
- token_type MUST be Bearer
- access_token MUST be JWT
- id_token MUST be JWT
- claims MUST align with granted scopes

---

## XII. Boundary Rules

### oidc

Owns:

- JWT access_token issuance
- ID Token issuance
- claims mapping
- /userinfo
- OIDC protocol token response

Must NOT:

- query user DB directly
- own user identity lifecycle
- reuse token-lifecycle
- implement refresh/revoke/introspection/session behavior in Sprint 10

### auth

Owns:

- credential validation only

Must NOT:

- generate JWT access_token
- generate ID Token
- generate refresh token
- manage OIDC session

### users

Owns:

- identity data
- approved identity lookup contract

Must NOT:

- issue OIDC tokens
- own claims mapping
- own OIDC protocol behavior

---

## XIII. Security Rules

Mandatory:

- no password_hash in any JWT or UserInfo response
- no raw secrets in logs
- no token payload logging
- no unsigned JWT
- no `alg: none`
- no direct DB projection as claims
- no raw refresh token behavior
- no session behavior in Sprint 10

---

## XIV. Validation Requirements

### Static Validation

Required commands:

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run format:check
npm.cmd run build
```

### Boundary Validation

Required scans:

```bash
rg -n "process\\.env" src --glob "!src/config/**"
rg -n "UserModel|user\\.repository|findById|findOne" src/modules/oidc
rg -n "token-lifecycle" src/modules/oidc
rg -n "refresh|revoke|rotation|introspection|session|sso" src/modules/oidc
rg -n "jwt|sign|id_token|access_token" src/modules/auth
rg -n "password_hash|passwordHash" src/modules/oidc
```

Expected result:

- no direct process.env outside config
- no direct user DB access from oidc
- no token-lifecycle usage in oidc
- no Phase 05 lifecycle leakage
- no token generation in auth
- no password hash exposure

### Runtime Validation

Required scenarios:

- valid authorization-code exchange returns JWT access_token and ID Token
- JWT access_token verifies against JWKS public key
- ID Token verifies against JWKS public key
- invalid/expired JWT is rejected
- /userinfo returns only scope-approved claims
- /userinfo rejects missing bearer token
- /userinfo rejects malformed bearer token
- password_hash never appears in token or response

---

## XV. Merge-Blocking Conditions

Block Sprint 10 PR if any of these occur:

- JWT contract not referenced
- access_token is not JWT
- ID Token is missing
- claims bypass claims.mapper
- oidc directly queries user DB
- auth generates any token
- refresh/revoke/introspection/session logic appears
- token-lifecycle is reused for OIDC tokens
- password_hash appears in token or UserInfo
- validation evidence is missing or placeholder-only

---

## XVI. Definition of Done

Sprint 10 is complete when:

- JWT access_token is issued
- ID Token is issued
- both tokens are signed with RS256
- kid maps to JWKS key
- claims are mapped through claims.mapper
- /userinfo returns scope-based claims
- oidc/users/auth boundaries remain clean
- no Phase 05 lifecycle behavior is introduced
- all validation commands pass
- runtime scenarios are documented as PASS

---

## XVII. Handoff to Phase 05

After Sprint 10, Phase 04 provides the client-usable OIDC token and identity output baseline.

Phase 05 remains responsible for:

- refresh token lifecycle
- refresh token hashing
- rotation
- revoke
- introspection
- session lifecycle
- SSO behavior
- logout hardening

