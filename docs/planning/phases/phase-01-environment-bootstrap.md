# Phase 01 - Environment and Infrastructure Foundation

---

## I. Overview

### Objective

Establish the eTroy OIDC technical baseline:

- standardized runtime environment
- controlled configuration distribution
- infrastructure abstraction foundation

### Out of Scope

- business logic implementation (`auth`, `users`, and other domain features)
- OIDC protocol flow implementation
- production token lifecycle feature implementation

---

## II. Sprint Breakdown

| Sprint    | Scope                 |
| --------- | --------------------- |
| Sprint 01 | Environment Bootstrap |
| Sprint 02 | Config Distribution   |
| Sprint 03 | Infrastructure Layer  |

---

## III. Sprint 01 - Environment Bootstrap

### Goal

Create a base project aligned with:

- `docs/architecture/source-tree.md`
- `docs/architecture/module-boundaries.md`

### Task 01 - Initialize Repository Baseline

#### Context

- `docs/architecture/source-tree.md`

#### Contract

- Node.js project with ESM configuration
- normalized `package.json` baseline

#### Implementation

```bash
npm init -y
npm pkg set type="module"
npm pkg set private=true
```

### Task 02 - TypeScript Baseline

#### Contract

- TypeScript strict mode enabled
- compilation setup aligned with approved source structure
- avoid compiling unintended generated artifacts

#### Implementation (example baseline)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "moduleResolution": "node"
  }
}
```

### Task 03 - Lint and Formatting Baseline

#### Contract

- ESLint and Prettier baseline
- no contradictory lint and format rules

#### Implementation

```bash
npm install -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier
```

### Task 04 - Project Structure Baseline

#### Contract

Structure must align with approved `source-tree.md`.

```text
src/
  app/
  config/
  infrastructure/
  modules/
  shared/
  jobs/
  tests/
```

---

## IV. Sprint 02 - Config Distribution

### Goal

Establish a production-oriented configuration boundary.

### Task 05 - Config Schema

#### Contract

- typed configuration contract
- no direct `process.env` access outside config layer

### Task 06 - Environment Loader

#### Implementation

```ts
import dotenv from 'dotenv';

dotenv.config();
```

### Task 07 - Config Validation

#### Contract

- validate configuration at startup
- fail fast on missing or invalid required configuration

### Task 08 - Config Access Layer

#### Implementation

```ts
export const config = {
  port: process.env.PORT,
};
```

Note: production implementation should keep environment parsing and typed export separated (for example via `env.ts` and `config.ts`).

---

## V. Sprint 03 - Infrastructure Layer

### Goal

Abstract infrastructure dependencies behind approved boundaries.

### Task 09 - Database Module

#### Contract

- no raw driver ownership leakage to domain modules
- centralized MongoDB connection management
- use `config` from `src/config/config.ts`
- fail fast on connection failure

#### Deliverables

- `src/infrastructure/database/connection.ts`
- `src/infrastructure/database/index.ts`

### Task 10 - Redis Module

#### Contract

- centralized connection setup
- no ad-hoc direct Redis coupling in domain modules
- use `config` from `src/config/config.ts`
- single shared client instance

#### Deliverables

- `src/infrastructure/redis/client.ts`
- `src/infrastructure/redis/index.ts`

### Task 11 - Logger Module

#### Contract

- structured logging baseline
- avoid uncontrolled `console.log` usage in runtime paths
- environment-based log level via config

#### Deliverables

- `src/infrastructure/logger/logger.ts`
- `src/infrastructure/logger/index.ts`

### Task 12 - Crypto + JWKS / RSA

#### Contract

- RSA private/public key loading from `keys/`
- JWKS generation from public key material
- hashing utilities for later refresh-token lifecycle use
- no token signing logic in this task

#### Deliverables

- `src/infrastructure/crypto/keys.ts`
- `src/infrastructure/crypto/jwks.ts`
- `src/infrastructure/crypto/hash.ts`
- `src/infrastructure/crypto/index.ts`

### Task 13 - Mail Service

#### Contract

- interface-based service design
- no vendor lock-in in module-level contracts
- no business workflow ownership (verification/reset)

#### Deliverables

- `src/infrastructure/mail/mail.service.ts`
- `src/infrastructure/mail/index.ts`

### Task 14 - Metrics + Base Error Handling

#### Contract

- basic metrics hooks available
- reusable base error shape in shared layer
- advanced monitoring stack can be deferred

#### Deliverables

- `src/infrastructure/metrics/metrics.ts`
- `src/shared/errors/base.error.ts`
- `src/shared/errors/index.ts`

---

## VI. Definition of Done

Phase 01 is complete when:

- baseline project starts correctly
- configuration loads and validates correctly
- database connectivity baseline works
- logging baseline works
- no `module-boundaries.md` violations are introduced

---

## VII. Enforcement Rules

- do not introduce forbidden boundary imports
- do not use `process.env` outside configuration boundary
- do not hardcode environment-specific config values
- do not introduce uncontrolled runtime logging patterns

---

## VIII. Output

Phase 01 output:

- environment and infrastructure baseline ready
- repository ready for Identity Core implementation phases
