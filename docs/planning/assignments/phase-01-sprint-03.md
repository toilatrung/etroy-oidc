# Phase 01 - Sprint 03

## I. Sprint Identity

- Phase: Phase 01 - Environment and Infrastructure Foundation
- Sprint: Sprint 03 - Infrastructure Layer
- Implementation Level: Production-ready baseline

---

## II. Objective

Establish a complete infrastructure layer baseline, including:

- Database (MongoDB)
- Redis
- Structured logging (Pino)
- Crypto (JWKS + RSA loading + hashing utilities)
- Mail abstraction
- Metrics baseline
- Base error handling

All components must strictly comply with:

- Configuration boundary from Sprint 02
- Repository structure contract
- Module boundary rules

---

## III. Global Rules

These rules apply to all tasks:

- No `process.env` outside `src/config/`
- Only use `config` from `src/config/config.ts`
- No business logic inside infrastructure
- No cross-module boundary violation
- No direct dependency from infrastructure to `modules/*`
- Fail fast where required (config / critical infra)
- All exports must be reusable and clean
- No `console.log`; use structured logger
- No architecture deviation from source of truth

---

## IV. Task Breakdown

### Task 09 - Database Layer (MongoDB)

#### Objective

Establish centralized MongoDB connection layer.

#### In Scope

- Mongoose connection setup
- Connection lifecycle handling
- Centralized connection export

#### Deliverables

- `src/infrastructure/database/connection.ts`
- `src/infrastructure/database/index.ts`

#### Rules

- Use config for URI
- No model definition here
- No business logic

#### Acceptance Criteria

- Connection initialized successfully
- Fail fast if connection fails
- No duplicated connection instance

#### Validation

- Start app -> DB connects successfully
- Simulate wrong URI -> app fails fast

### Task 10 - Redis Layer

#### Objective

Establish centralized Redis client.

#### In Scope

- Redis client setup via ioredis
- Connection handling

#### Deliverables

- `src/infrastructure/redis/client.ts`
- `src/infrastructure/redis/index.ts`

#### Rules

- Use config only
- Single shared client instance

#### Acceptance Criteria

- Redis connects successfully
- Reusable client export

#### Validation

- Ping Redis -> success
- Wrong config -> fail fast

### Task 11 - Structured Logger (Pino)

#### Objective

Provide structured logging baseline.

#### In Scope

- Pino logger setup
- Environment-based log level
- Optional pretty dev output

#### Deliverables

- `src/infrastructure/logger/logger.ts`
- `src/infrastructure/logger/index.ts`

#### Rules

- No `console.log` anywhere
- Logger must be injectable

#### Acceptance Criteria

- Logs structured (JSON)
- Log level controlled by config

#### Validation

- Log output verified in dev + prod mode

### Task 12 - Crypto + JWKS / RSA

#### Objective

Provide cryptographic infrastructure baseline.

#### In Scope

- RSA private/public key loading from `keys/`
- JWKS structure generation (public keys)
- Hashing utilities (for refresh token later)

#### Deliverables

- `src/infrastructure/crypto/keys.ts`
- `src/infrastructure/crypto/jwks.ts`
- `src/infrastructure/crypto/hash.ts`
- `src/infrastructure/crypto/index.ts`

#### Rules

- No token signing logic yet
- Only infrastructure-level utilities
- Keys must not be hardcoded

#### Acceptance Criteria

- RSA keys load successfully
- JWKS can be generated
- Hash function works

#### Validation

- Load keys -> no error
- Output JWKS JSON valid

### Task 13 - Mail Service (Abstraction)

#### Objective

Define mail service interface for future use.

#### In Scope

- Interface-based mail service
- Placeholder provider implementation

#### Deliverables

- `src/infrastructure/mail/mail.service.ts`
- `src/infrastructure/mail/index.ts`

#### Rules

- No business workflow (verification/reset)
- Only sending abstraction

#### Acceptance Criteria

- Mail service callable
- Provider can be swapped

#### Validation

- Mock send email -> success

### Task 14 - Metrics + Base Error Handling

#### Objective

Provide observability + error baseline.

#### In Scope

- Lightweight metrics hook (counter/timer placeholder)
- Base error class + standardized error shape

#### Deliverables

- `src/infrastructure/metrics/metrics.ts`
- `src/shared/errors/base.error.ts`
- `src/shared/errors/index.ts`

#### Rules

- Error must be reusable across modules
- No framework lock-in

#### Acceptance Criteria

- Error object standardized
- Metrics callable

#### Validation

- Throw base error -> structured output
- Metrics increment works

---

## V. Deliverable Summary

Must exist:

- `database/`
- `redis/`
- `logger/`
- `crypto/`
- `mail/`
- `metrics/`
- Base error handling

All deliverables must be under the correct source-tree structure.

---

## VI. Validation Checklist

- Lint passes
- Typecheck passes
- Build passes
- DB connection OK
- Redis connection OK
- Logger works
- RSA/JWKS works
- No `process.env` leakage
- No boundary violation

---

## VII. Branch

`feature/infrastructure-sprint03-baseline`

---

## VIII. Final Note

This sprint defines the system backbone.

If this layer is wrong:

- OIDC cannot be implemented correctly
- Token system will break
- Security model will collapse

Absolute priority: correctness, boundary discipline, and reusability.
