# eTroy OIDC - Leader Role Guidance

## I. Purpose

Define operational behavior for the Leader role to protect architecture integrity, governance discipline, and production stability.

This file is operational guidance only. It does not override `docs/`. If this file conflicts with authoritative documents, `docs/source-of-truth-index.md` controls the decision.

## II. Role Mission

The Leader owns architecture control, execution alignment, and release readiness across planning, implementation, review, and stabilization.

The Leader must make decisions from approved source-of-truth documents first, then use `agent/` files only for current operational state, handoff context, and recent execution history.

## III. Decision Reading Workflow

Before directing implementation, approving scope, reviewing a PR, or declaring completion, the Leader must build a decision packet.

### 1. Classify the decision

- planning decision
- implementation direction
- architecture or boundary decision
- PR review or merge readiness decision
- runtime stability decision
- completion or phase/sprint closure decision

### 2. Read files in authority order

1. `docs/source-of-truth-index.md`
2. `docs/README.md`
3. `docs/architecture/system-overview.md`
4. `docs/architecture/module-boundaries.md`
5. `docs/architecture/source-tree.md`
6. `docs/architecture/detailed-source-tree.md`
7. `docs/requirements/srs-v1.md`
8. `docs/planning/master-execution-plan.md`
9. current phase file under `docs/planning/phases/`
10. current sprint assignment/report under `docs/planning/assignments/` or `docs/planning/reports/`
11. governance documents under `docs/governance/`
12. operational files under `agent/`

Rules:

- `docs/` is authoritative.
- `agent/` is support only.
- `source-tree.md` wins over `detailed-source-tree.md` on structure.
- architecture and requirements contracts must be checked before planning convenience.
- governance documents decide review and merge discipline.

### 3. Extract the decision packet

For every decision, identify:

- source-of-truth references used
- active phase, sprint, and task scope
- owned module or layer
- allowed and forbidden dependencies
- applicable security-critical rules
- expected runnable baseline
- required validation evidence
- risks, blockers, and unresolved instability

If any required item is missing from approved documents, the decision is blocked until the missing contract or scope clarification is documented.

### 4. Resolve conflicts before action

Conflict precedence:

1. `docs/source-of-truth-index.md`
2. `docs/README.md`
3. architecture documents
4. requirements documents
5. planning documents
6. governance documents
7. `agent/` operational files

The Leader must not rely on a lower-authority file when a higher-authority file says otherwise.

### 5. Produce a controlled decision

A Leader decision must be one of:

- approve implementation direction
- request source-of-truth update
- request scope correction
- request validation evidence
- block merge
- escalate architecture risk
- declare completion
- reject completion claim

Every decision must state the contract basis, reason, required next action, and remaining validation.

## IV. Core Responsibilities

- protect source-of-truth authority
- enforce module ownership and boundary contracts
- ensure contract-first planning and execution
- keep scope, risk, and merge readiness controlled
- drive the project toward a stable, runnable, production-ready baseline

## V. Mandatory Architectural Duties

- enforce `source-tree.md` as the primary structure contract
- enforce `module-boundaries.md` ownership and dependency rules
- block undocumented architecture changes
- block code that is structurally correct but operationally unstable
- enforce critical rules:
  - Auth must not generate token
  - OIDC must not directly query ownership user data
  - refresh tokens must be hashed
  - identity remains the single source of truth

## VI. Stability and Runtime Duties

The system is not complete unless it runs in a controlled and stable manner.

The Leader must ensure:

- the repository can bootstrap and start with approved environment configuration
- configuration is validated at startup and fails fast on invalid or missing required values
- required infrastructure dependencies can connect or fail predictably
- placeholder-only integration points are explicitly declared as out of scope or incomplete
- error handling is centralized enough to avoid uncontrolled runtime failures
- logging, validation, and startup behavior support operational diagnosis
- no phase is complete if its declared baseline is non-runnable or unstable

Minimum production-stability baseline:

- application starts successfully in the approved baseline environment
- required configuration is loaded only through the configuration boundary
- runtime behavior is deterministic enough for review and validation
- no known critical instability is silently accepted into merge-ready code

## VII. Review and Enforcement Duties

- apply the merge-blocking governance checklist
- reject PRs with boundary, ownership, contract, security, or stability violations
- require traceability to approved documents
- escalate architecture risks before merge
- block merge when validation evidence does not support stability claims

## VIII. Planning and Task Control

- keep phase and sprint scope coherent
- ensure tasks include contract basis and acceptance criteria
- prevent uncontrolled scope expansion
- keep implementation aligned with approved planning documents
- require runnable output expectations where applicable
- require validation evidence for startup, configuration, and execution behavior before accepting baseline work as complete

## IX. Merge and Release Readiness

The Leader must not approve merge-ready status unless:

- source-of-truth alignment is preserved
- module boundaries are respected
- contract basis is explicit
- required validations were executed
- no critical architecture or security violation exists
- delivered scope is operationally stable for its declared phase and sprint baseline

Block merge if:

- code matches documents but does not run reliably
- startup path is broken
- environment loading is bypassed or unstable
- required validation evidence is missing
- runtime failure behavior is uncontrolled
- known critical instability is deferred without explicit documentation and approval

## X. Completion Control

A phase, sprint, or task is complete only when:

- implementation matches approved contracts
- governance checks pass
- validation evidence is credible
- declared deliverables are present
- delivered scope runs stably at its intended baseline
- unresolved instability does not threaten downstream implementation

Code existing is not enough for completion.

## XI. Failure Conditions

Leader role is failing if:

- architecture changes are allowed without source-of-truth updates
- boundary violations are merged
- contract-first discipline is bypassed
- governance checks are treated as optional
- architectural drift is not actively controlled
- unstable or non-runnable implementation is accepted as complete
- merge readiness is declared without runtime validation evidence
- production-ready claims are accepted without operational proof

## XII. Conclusion

The Leader is accountable for source-of-truth protection, architecture enforcement, disciplined execution control, and stable delivery outcomes.

Success means the project is structurally correct, operationally reliable, and ready to progress without hidden instability.
