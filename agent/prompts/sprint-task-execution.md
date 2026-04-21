# eTroy OIDC - Sprint / Task Execution Prompt

## Purpose

Use this prompt to execute a sprint or task with contract-first discipline.

It is optimized for the relationship already used in this repository:

- `docs/` defines what is approved.
- `docs/planning/assignments/` defines active task scope.
- `docs/planning/reports/` gives completed-work evidence and handoff context.
- `docs/governance/` defines review and merge blockers.
- `agent/` provides operational continuity only.

This prompt is operational support only. It cannot override `docs/`.

## Source Relationship

Apply this authority chain before implementation:

1. `docs/source-of-truth-index.md` - authority and conflict rules
2. `docs/README.md` - navigation
3. `docs/architecture/*` - ownership, boundaries, and structure
4. `docs/requirements/srs-v1.md` - required behavior
5. `docs/planning/master-execution-plan.md` - execution lifecycle
6. `docs/planning/phases/*` - phase scope
7. `docs/planning/assignments/*` - sprint/task scope
8. `docs/planning/reports/*` - historical evidence and handoff
9. `docs/governance/*` - PR, review, and anti-pattern controls
10. `agent/*` - non-authoritative operational context

Conflict rules:

- `docs/` beats `agent/`.
- Architecture beats planning convenience.
- Requirements beat implementation preference.
- `source-tree.md` beats `detailed-source-tree.md`.
- No approved contract means no implementation.

## Prompt Variables

Fill these values before using the prompt:

```text
[PHASE_NAME]
[SPRINT_NAME]
[TASK_IDS_AND_NAMES]
[OWNER_MODULE_OR_LAYER]
[BRANCH_NAME]
[CURRENT_PHASE_DOC_PATH]
[CURRENT_ASSIGNMENT_DOC_PATH]
[LATEST_RELEVANT_REPORT_PATHS]
[ROLE_GUIDANCE_PATH]
[INCLUDED_SCOPE_LIST]
[EXCLUDED_SCOPE_LIST]
[EXPECTED_DELIVERABLES]
[ALLOWED_DEPENDENCIES]
[FORBIDDEN_DEPENDENCIES]
[SECURITY_CRITICAL_RULES]
[VALIDATION_COMMANDS]
[MANUAL_VALIDATION_CHECKS]
[HANDOFF_TARGET]
```

## Primary Prompt

Copy this block into a new execution session after filling the variables.

```text
You are working in the eTroy OIDC repository.

Goal:
Execute [PHASE_NAME] / [SPRINT_NAME] / [TASK_IDS_AND_NAMES] safely, completely, and traceably.

Execution target:
- Phase: [PHASE_NAME]
- Sprint: [SPRINT_NAME]
- Task(s): [TASK_IDS_AND_NAMES]
- Owner module/layer: [OWNER_MODULE_OR_LAYER]
- Branch: [BRANCH_NAME]
- Assignment: [CURRENT_ASSIGNMENT_DOC_PATH]

Authority:
- `docs/` is authoritative.
- `agent/` is operational support only.
- If `agent/` conflicts with `docs/`, follow `docs/`.
- If `source-tree.md` conflicts with `detailed-source-tree.md`, follow `source-tree.md`.
- Do not implement undocumented architecture, structure, behavior, or scope.

Required reading order:
1. `docs/source-of-truth-index.md`
2. `docs/README.md`
3. `docs/architecture/system-overview.md`
4. `docs/architecture/module-boundaries.md`
5. `docs/architecture/source-tree.md`
6. `docs/architecture/detailed-source-tree.md`
7. `docs/requirements/srs-v1.md`
8. `docs/planning/master-execution-plan.md`
9. [CURRENT_PHASE_DOC_PATH]
10. [CURRENT_ASSIGNMENT_DOC_PATH]
11. [LATEST_RELEVANT_REPORT_PATHS]
12. `docs/governance/git-rules.md`
13. `docs/governance/pr-template.md`
14. `docs/governance/review-checklist.md`
15. `docs/governance/anti-patterns.md`
16. `agent/current-context.md`
17. [ROLE_GUIDANCE_PATH]

Before coding, produce an implementation packet:
- source-of-truth documents used
- active phase, sprint, and task range
- owner module/layer
- included scope
- excluded scope
- expected deliverables
- allowed dependencies
- forbidden dependencies
- security-critical rules
- validation commands
- manual validation checks
- blockers or ambiguous contracts

Included scope:
[INCLUDED_SCOPE_LIST]

Excluded scope:
[EXCLUDED_SCOPE_LIST]

Expected deliverables:
[EXPECTED_DELIVERABLES]

Allowed dependencies:
[ALLOWED_DEPENDENCIES]

Forbidden dependencies:
[FORBIDDEN_DEPENDENCIES]

Security-critical rules:
[SECURITY_CRITICAL_RULES]

Implementation rules:
- Implement only approved assignment scope.
- Preserve module ownership from `module-boundaries.md`.
- Preserve file placement from `source-tree.md`.
- Keep controllers thin.
- Keep persistence behind the owning repository layer.
- Keep infrastructure adapter-only.
- Keep shared code generic and cross-cutting.
- Do not duplicate ownership logic across modules.
- Do not use `process.env` outside `src/config/`.
- Do not add unrelated cleanup, refactors, dependencies, folders, or behavior.

Workflow:
1. Inspect current files before editing.
2. Compare existing code against the assignment, architecture, and requirements.
3. Identify the minimal contract-backed change set.
4. Edit only approved files unless a small contract-backed wiring change is required.
5. Re-check scope, ownership, boundary, and security rules.
6. Run validation.
7. Record each validation as PASS, FAIL, or NOT RUN with reason.
8. Produce the final task report and handoff note.

Required validation:
[VALIDATION_COMMANDS]

Manual validation:
[MANUAL_VALIDATION_CHECKS]

Stop before coding if:
- a required contract is missing
- documents conflict and cannot be resolved by authority order
- behavior belongs to another sprint or module
- a new structure is needed but not approved
- dependency direction would violate `module-boundaries.md`
- secure handling cannot be implemented from available contracts

Final response format:
1. Completed work
2. Source-of-truth basis
3. Files created or updated
4. Validation results
5. Included scope
6. Excluded scope
7. Risks, limitations, or blockers
8. Handoff note for [HANDOFF_TARGET]

Do not claim completion without validation evidence.
```

## Preset - Phase 02 / Sprint 04

Use these values with the primary prompt for the current active sprint.

```text
[PHASE_NAME]
Phase 02 - Identity Core

[SPRINT_NAME]
Sprint 04 - User Module

[TASK_IDS_AND_NAMES]
Task 15 - User Model; Task 16 - User Repository; Task 17 - User Service; Task 18 - User Controller

[OWNER_MODULE_OR_LAYER]
`src/modules/users`

[BRANCH_NAME]
`feature/users-sprint04-core`

[CURRENT_PHASE_DOC_PATH]
`docs/planning/phases/phase-02-identity-core.md`

[CURRENT_ASSIGNMENT_DOC_PATH]
`docs/planning/assignments/phase-02-sprint-04.md`

[LATEST_RELEVANT_REPORT_PATHS]
`docs/planning/reports/phase-01-sprint-03-report.md`

[ROLE_GUIDANCE_PATH]
`agent/roles/dev.md`

[INCLUDED_SCOPE_LIST]
- user identity model and persistence
- user repository methods
- create user
- retrieve user
- controlled profile update
- controlled password change
- password hashing before persistence
- password re-hashing during password change
- email uniqueness enforcement
- username uniqueness enforcement
- controller-level user lifecycle endpoints
- use existing database and crypto hash infrastructure

[EXCLUDED_SCOPE_LIST]
- `auth` module changes
- credential validation flow
- token or JWT generation
- session management
- verification flow
- password-reset flow
- OIDC protocol flow
- identity storage outside `users`
- infrastructure expansion

[EXPECTED_DELIVERABLES]
- `src/modules/users/user.model.ts`
- `src/modules/users/user.repository.ts`
- `src/modules/users/user.service.ts`
- `src/modules/users/user.controller.ts`

[ALLOWED_DEPENDENCIES]
- `src/infrastructure/database`
- `src/infrastructure/crypto`
- `src/shared/errors`
- generic TypeScript and Express/Mongoose types already used by the project

[FORBIDDEN_DEPENDENCIES]
- token/JWT/session logic
- direct ownership access from other modules
- `auth`, `verification`, `password-reset`, or `oidc` behavior
- new infrastructure adapters
- direct `process.env`

[SECURITY_CRITICAL_RULES]
- never persist a plain password
- never log secrets or full credentials
- never introduce token/session behavior in `users`
- enforce identity single source of truth in `users`

[VALIDATION_COMMANDS]
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run format:check`
- `npm.cmd run build`
- `rg -n "process\\.env" src --glob "!src/config/**"`
- `rg -n "console\\.log" src`
- `rg -n "jwt|token|session|OIDC|authorize|refresh" src/modules/users`
- `rg -n "password" src/modules/users`

[MANUAL_VALIDATION_CHECKS]
- create user succeeds
- duplicate email fails
- duplicate username fails
- stored password is hashed only
- profile update mutates controlled fields only
- password change re-hashes the new password
- no direct database access outside `user.repository.ts`
- no identity duplication outside `src/modules/users`
- no auth, token, session, verification, reset, or OIDC flow logic

[HANDOFF_TARGET]
Sprint 05 - Auth Module
```

## Short Prompt

Use this only when the session already loaded the source-of-truth context.

```text
Execute [PHASE_NAME] / [SPRINT_NAME] / [TASK_IDS_AND_NAMES] from [CURRENT_ASSIGNMENT_DOC_PATH].

Use `docs/` as authority and `agent/` only as operational context.

Before coding, produce:
- scope in/out
- owner module/layer
- deliverables
- allowed/forbidden dependencies
- validation plan
- blockers, if any

Then implement only approved scope and validate with:
[VALIDATION_COMMANDS]

Final report:
- files changed
- validation evidence
- boundary/security checks
- risks or limitations
- handoff note

Stop if implementation requires undocumented architecture, forbidden dependency direction, or scope owned by another sprint/module.
```

