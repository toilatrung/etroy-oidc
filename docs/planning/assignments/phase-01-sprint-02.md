# Phase 01 - Sprint 02

## I. Sprint Identity

- **Phase:** Phase 01 - Environment and Infrastructure Foundation
- **Sprint:** Sprint 02 - Config Distribution Standard
- **Objective:** Establish a production-ready configuration boundary with typed schema, controlled environment loading, startup validation, normalized config export, and path alias baseline.

## II. Source-of-Truth Basis

- `docs/source-of-truth-index.md`
- `docs/README.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/module-boundaries.md`
- `docs/architecture/source-tree.md`
- `docs/architecture/detailed-source-tree.md`
- `docs/requirements/srs-v1.md`
- `docs/planning/master-execution-plan.md`
- `docs/planning/phases/phase-01-environment-bootstrap.md`
- `docs/governance/git-rules.md`
- `docs/governance/pr-template.md`
- `docs/governance/review-checklist.md`

**Conflict rules:**
- `source-of-truth-index.md` wins first
- `source-tree.md` wins over `detailed-source-tree.md`

---

# Assigned Task Detail — Dev

## 1. Task Identity

- **Assignee:** Viet Anh Nguyen Xuan
- **Role:** Dev
- **Scope type:** Sprint-level + task-level implementation package
- **Priority:** High
- **Branch:** `feature/config-sprint02-distribution`

### Related Tasks
- Task 05 - Config Schema
- Task 06 - Environment Loader
- Task 07 - Config Validation
- Task 08 - Config Access Layer

## 2. Objective

- Build a production-ready configuration boundary inside `src/config/`
- Eliminate uncontrolled environment access by centralizing all runtime configuration parsing and export
- Establish typed validation using `Zod`
- Use `dotenv` for environment loading
- Separate `schema.ts`, `env.ts`, and `config.ts`
- Introduce path alias baseline from Sprint 02 onward
- Prepare the repository for Sprint 03 infrastructure integrations without config leakage

## 3. In Scope

### Sprint-level scope
- implement complete config distribution baseline for the repository
- make configuration loading explicit, typed, centralized, and fail-fast
- ensure all future layers consume normalized config instead of raw `process.env`

### Task-level scope

#### Task 05 - Config Schema
- create `src/config/schema.ts`
- define Zod schema for required and optional environment variables
- define type-safe parsing contract for runtime configuration
- model baseline fields required for current and near-next phases

#### Task 06 - Environment Loader
- create `src/config/env.ts`
- use `dotenv` to load environment variables
- ensure environment loading happens from one approved place only
- avoid scattered or repeated environment bootstrap logic

#### Task 07 - Config Validation
- validate env values at startup
- fail fast when required variables are missing or malformed
- produce structured error output suitable for debugging
- ensure secret values are not echoed unsafely in logs/errors

#### Task 08 - Config Access Layer
- create `src/config/config.ts`
- export normalized, typed config object for application use
- ensure application code uses config abstraction rather than direct environment reads
- prepare config surface for future `app`, `infrastructure`, and `modules` usage

### Path alias baseline
- enable path alias from Sprint 02 onward
- align alias configuration with TypeScript setup and repository structure
- keep alias naming consistent and minimal
- avoid alias patterns that hide module boundaries or encourage cross-domain shortcuts

## 4. Out of Scope

- no business logic implementation
- no `users`, `auth`, `verification`, `password-reset`, or `oidc` feature logic
- no token issuance logic
- no session logic
- no MongoDB or Redis adapter implementation beyond config readiness
- no logger, mail, or metrics implementation
- no undocumented structural or architecture changes
- no ad-hoc alias scheme outside approved repository logic
- no direct use of `process.env` outside `src/config/`

## 5. Required Deliverables

### Core config files
- `src/config/schema.ts`
- `src/config/env.ts`
- `src/config/config.ts`

### Supporting updates
- update `tsconfig.json` to support path alias
- update package/tooling config if alias resolution or startup requires it
- update `src/index.ts` or approved startup entry wiring so config validation happens in runtime bootstrap
- update `.env.example` to reflect current config contract

### Expected config coverage
At minimum, baseline config should cover fields required for current foundation and upcoming infrastructure readiness, such as:
- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `REDIS_URL`
- mail-related placeholder contract fields if needed for future integration
- crypto/key path placeholders if needed for near-phase readiness

### Documentation / reporting outputs
- implementation-ready PR using the repository PR template
- Task Report after completion
- concise handoff note for the next sprint/task if needed

## 6. Rules

- no scope expansion
- respect `module-boundaries.md`
- respect `source-tree.md`
- no undocumented architecture change
- no direct `process.env` access outside `src/config/`
- no business logic in `config`
- no secret leakage in logs or validation output
- no alias pattern that bypasses layer discipline
- keep changes traceable to Phase 01 / Sprint 02 / Tasks 05-08
- follow branch / commit / PR rules from governance documents

## 7. Implementation Guidance

### Expected file responsibility

#### `src/config/schema.ts`
- owns Zod schema definition only
- defines shape, required/optional fields, and validation constraints
- must not contain business logic

#### `src/config/env.ts`
- owns raw environment loading and parsing bridge
- calls schema parse/safeParse flow against loaded input
- produces validated env object or throws fail-fast startup error

#### `src/config/config.ts`
- owns normalized config export
- maps validated env into application-facing config object
- may normalize primitive values such as port number, booleans, environment mode, and nested groupings if useful
- must remain explicit and readable

### Path alias guidance
- alias must be enabled now and used consistently
- alias naming should reflect architecture, not convenience hacks
- alias should not encourage direct cross-module ownership bypass
- keep import paths predictable and review-friendly

## 8. Acceptance Criteria

- [ ] `src/config/schema.ts` exists and defines a typed Zod-based environment contract
- [ ] `src/config/env.ts` exists and is the approved environment loader/validation entry
- [ ] `src/config/config.ts` exists and exports normalized typed config
- [ ] `dotenv` is used from the approved config boundary
- [ ] `process.env` is not accessed directly outside `src/config/`
- [ ] startup fails fast on missing or invalid required configuration
- [ ] startup succeeds when valid environment values are present
- [ ] path alias baseline is configured and usable
- [ ] `.env.example` matches the implemented config contract
- [ ] no boundary violation is introduced
- [ ] no business logic is introduced into `config`, `shared`, or `infrastructure`
- [ ] implementation remains fully traceable to Sprint 02 contract
- [ ] Task Report is submitted after completion

## 9. Validation Requirements

Dev must perform and record at minimum:

### Static validation
- install succeeds
- TypeScript config remains valid
- path alias compiles/resolves correctly
- lint passes
- format check passes

### Runtime validation
- startup with valid env passes
- startup with missing required env fails fast
- startup with invalid typed env fails fast
- failure message is structured and useful
- failure path does not expose raw secret values

### Manual validation evidence
- confirm no direct `process.env` usage exists outside `src/config/`
- confirm file placement aligns with `source-tree.md`
- confirm config flow is centralized and not duplicated

## 10. Suggested Commands to Record in Task Report

```bash
npm install
npx tsc --noEmit
npm run lint
npm run format:check
npm run dev
```

If separate startup checks are used, record them as well.

## 11. Commit and PR Rules

### Branch
- `feature/config-sprint02-distribution`

### Commit format
```text
<type>(<scope>): <message>
```

### Suggested commit examples
- `build(config): add zod schema for runtime environment`
- `feat(config): add centralized env loader and validation`
- `refactor(config): separate schema env and normalized config export`
- `chore(governance): align env example with config contract`
- `build(shared): enable path alias baseline for sprint 02`

### PR handling
- use the existing PR template from `.github`
- PR must stay within Sprint 02 config scope
- PR must include explicit included scope and excluded scope
- PR must provide validation evidence
- PR must reference Phase 01 / Sprint 02 / Tasks 05-08

## 12. Required Report Back

Dev must submit a **Task Report** containing:

- task identity
  - phase
  - sprint
  - related tasks
  - branch name
  - PR title
- source-of-truth basis actually used
- files created and updated
- commands executed
- validation result summary
- scope statement
  - what was included
  - what was intentionally not done
- risks / limitations / deferred items
- handoff note for Sprint 03 readiness

---

## Sprint 02 Completion Condition

Sprint 02 is considered ready for Leader review only when:

- Dev implementation is complete within declared scope
- validation evidence is attached and credible
- Task Report is submitted
- PR remains compliant with source-of-truth and governance rules
