# eTroy OIDC - Dev Role Guidance

## I. Purpose

Define operational behavior for the Dev role under contract-first and architecture-enforcement rules.

This file is operational guidance only. It does not override `docs/`. If this file conflicts with authoritative documents, `docs/source-of-truth-index.md` controls the decision.

## II. Role Mission

Implement changes safely within approved ownership boundaries and source-of-truth contracts.

The Dev role must implement from approved `docs/` contracts first, then use `agent/` files only for current operational state, handoff context, and execution continuity.

## III. Core Responsibilities

- implement only approved scope
- preserve module ownership and dependency boundaries
- keep changes traceable to requirements and planning
- maintain implementation quality and consistency
- surface missing or conflicting contracts before coding
- provide validation evidence for delivered scope
- leave concise handoff notes when scope, implementation state, or risk changes

## IV. Mandatory Implementation Rules

- do not bypass module boundaries
- do not introduce undocumented structure or behavior
- do not duplicate ownership logic across modules
- do not violate critical architecture rules:
  - Auth must not generate token
  - OIDC must not directly query ownership user data
  - refresh tokens must be hashed
  - identity must remain single source of truth
- keep controllers thin and delegate business behavior to services
- keep persistence access behind the owning repository layer
- never persist plain-text passwords
- never add token, session, verification, reset, or OIDC flow behavior outside approved scope

## V. Contract-first Rules

- read source-of-truth documents before coding
- implement only approved contracts
- if contract is missing or ambiguous, stop and request clarification through documentation/governance flow
- keep code and document intent aligned
- do not let `agent/` files expand implementation scope beyond `docs/`
- update authoritative contracts before implementing structural or architecture changes

## VI. Implementation Workflow

Before coding, Dev must build an implementation packet.

Recommended support prompt:

- `agent/prompts/sprint-task-execution.md`

Prompt usage rules:

- use prompts only as operational support
- never let a prompt override `docs/`
- fill prompt variables from approved phase and sprint assignment documents
- stop before coding if the prompt exposes missing, conflicting, or unapproved scope

The implementation packet must identify:

- active phase, sprint, and task range
- owned module or layer
- approved source-of-truth references
- included and excluded scope
- allowed dependencies and forbidden dependencies
- security-critical rules
- required validation commands
- manual validation checks
- report-back requirements

During coding, Dev must:

- keep edits scoped to the approved module and task range
- follow existing project structure and naming conventions
- avoid infrastructure expansion unless explicitly approved
- keep business rules in the owning module
- record validation evidence before claiming completion

After coding, Dev must report:

- files created or updated
- commands executed
- validation results
- boundary and security checks
- scope included and excluded
- known risks or limitations
- handoff notes for the next sprint or role

## VII. Active Phase 02 / Sprint 04 Guardrails

Current active execution target:

- Phase: Phase 02 - Identity Core
- Sprint: Sprint 04 - User Module
- Owner module: `src/modules/users`
- Task range: Task 15 - Task 18

Approved Sprint 04 deliverables:

- `src/modules/users/user.model.ts`
- `src/modules/users/user.repository.ts`
- `src/modules/users/user.service.ts`
- `src/modules/users/user.controller.ts`

Sprint 04 implementation must include:

- user identity model and persistence
- create user
- retrieve user
- update controlled profile fields
- change password through a controlled hashed-password mutation
- email uniqueness enforcement
- username uniqueness enforcement
- controller-level user lifecycle APIs

Sprint 04 implementation must exclude:

- `auth` module changes
- credential validation flow
- token or JWT generation
- session management
- verification flow
- password-reset flow
- OIDC protocol flow
- identity storage outside `users`
- infrastructure expansion

## VIII. Required Reading Order

1. `docs/source-of-truth-index.md`
2. `docs/README.md`
3. `docs/architecture/system-overview.md`
4. `docs/architecture/module-boundaries.md`
5. `docs/architecture/source-tree.md`
6. `docs/architecture/detailed-source-tree.md`
7. `docs/requirements/srs-v1.md`
8. `docs/planning/master-execution-plan.md`
9. `docs/planning/phases/phase-02-identity-core.md`
10. `docs/planning/assignments/phase-02-sprint-04.md`
11. `docs/governance/git-rules.md`
12. `docs/governance/pr-template.md`
13. `docs/governance/review-checklist.md`
14. `docs/governance/anti-patterns.md`
15. `agent/current-context.md`

## IX. Validation Duties

Dev must run or explicitly report inability to run applicable validation.

Sprint 04 expected validation:

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run format:check`
- `npm.cmd run build`

Dev must also manually validate:

- no plain password persistence
- no direct database access outside the users repository
- no identity duplication outside `users`
- no token, session, verification, reset, or OIDC flow logic
- profile mutation is controlled
- password change re-hashes the new password

## X. Failure Conditions

Dev role is failing if any of these occur:

- code is implemented without contract basis
- module ownership is violated
- architecture/gov rules are bypassed for speed
- undocumented behavior is introduced
- merge-blocking review issues are ignored
- plain-text password can be persisted
- identity data is duplicated outside `users`
- Sprint 04 introduces auth, token, session, verification, reset, or OIDC flow behavior
- completion is claimed without validation evidence

## XI. Conclusion

The Dev role succeeds by implementing contract-first, boundary-safe, production-ready changes aligned with source-of-truth governance and current sprint scope.
