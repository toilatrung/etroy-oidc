# Assigned Task Detail

## I. Task Identity

**Phase:**  
Phase 01 - Environment and Infrastructure Foundation

**Sprint:**  
Sprint 01 - Environment Bootstrap

**Assigned Role:**  
Dev

**Task Scope Type:**  
Sprint-level implementation package

**Related Atomic Tasks:**

- Task 01 - Initialize Repository Baseline
- Task 02 - TypeScript Baseline
- Task 03 - Lint and Formatting Baseline
- Task 04 - Project Structure Baseline

**Priority:**  
High

**Execution Mode:**  
Contract-first implementation  
No scope expansion allowed

## II. Task Objective

Thiết lập baseline kỹ thuật ban đầu cho repository eTroy OIDC để chuẩn bị cho các phase triển khai sau, bảo đảm:

- project khởi tạo theo Node.js + ESM
- có TypeScript strict baseline
- có lint/format baseline nhất quán
- có cấu trúc thư mục đúng source of truth

Sprint này chỉ được xây nền tảng bootstrap.

Không được triển khai business logic.  
Không được triển khai OIDC flow.  
Không được triển khai token lifecycle.

## III. Source-of-Truth Basis

**Authoritative references:**

- `docs/source-of-truth-index.md`
- `docs/README.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/module-boundaries.md`
- `docs/architecture/source-tree.md`
- `docs/architecture/detailed-source-tree.md`
- `docs/planning/master-execution-plan.md`
- `docs/planning/phases/phase-01-environment-bootstrap.md`
- `docs/governance/git-rules.md`
- `docs/governance/pr-template.md`
- `docs/governance/review-checklist.md`

Implementation must follow authority order.

If any conflict appears:

- `source-of-truth-index.md` wins
- `source-tree.md` wins over `detailed-source-tree.md`

## IV. Architectural Context

This sprint belongs to Phase 01 and exists only to create the environment bootstrap baseline.

**Architectural constraints:**

- repository structure must match approved source-tree
- no business logic in infrastructure
- no hidden domain logic in shared
- no direct `process.env` usage outside config layer
- no undocumented structural drift
- no cross-module ownership leakage

This sprint is structural and foundational.

It is not a feature sprint.

## V. Assigned Work

### 1. Repository Baseline

Dev must:

- initialize Node.js project
- normalize `package.json` baseline
- enable ESM mode
- set project private mode
- keep package manifest minimal and clean

**Expected minimum:**

- `package.json` exists
- `"type": "module"`
- `"private": true`

### 2. TypeScript Baseline

Dev must:

- install TypeScript baseline dependencies
- create `tsconfig.json`
- enable strict mode
- align compilation setup with approved source structure
- avoid including unintended generated artifacts

**Expected result:**

- `tsconfig.json` is usable, strict, and aligned with `src/`

### 3. Lint and Formatting Baseline

Dev must:

- install ESLint and Prettier baseline
- connect TypeScript lint parser/plugin as required
- avoid contradictory lint/format rules
- add minimal package scripts needed for baseline validation

**Expected result:**

- repository can run lint/format baseline consistently
- no style-tool conflict is introduced

### 4. Project Structure Baseline

Dev must create the approved root and `src` structure.

**Required root-level structure:**

- `src/`
- `agent/`
- `keys/`
- `scripts/`
- `docs/`
- `.env`
- `.env.example`
- `.gitignore`
- `package.json`
- `tsconfig.json`
- `README.md`

**Required src structure:**

- `src/app/`
- `src/config/`
- `src/infrastructure/`
- `src/modules/`
- `src/shared/`
- `src/jobs/`
- `src/tests/`
- `src/index.ts`

At this sprint, only baseline structure is required.

Do not create ad-hoc directories outside approved structure.

## VI. Required Deliverables

Deliverables that must exist after completion:

### 1. Root baseline

- `package.json`
- `tsconfig.json`
- `.gitignore`
- `.env.example`
- `README.md`

### 2. Approved directory skeleton

- `src/`
- `agent/`
- `keys/`
- `scripts/`
- `docs/`

### 3. Source skeleton

- `src/app/`
- `src/config/`
- `src/infrastructure/`
- `src/modules/`
- `src/shared/`
- `src/jobs/`
- `src/tests/`
- `src/index.ts`

### 4. Tooling baseline

- ESLint config
- Prettier config
- package scripts for baseline checks

## VII. Explicitly Out of Scope

The following are forbidden in this assignment:

- implementing auth logic
- implementing users logic
- implementing verification or password-reset flows
- implementing OIDC provider flow
- implementing token generation or token storage
- implementing Redis/Mongo runtime adapters beyond bootstrap needs of this sprint
- introducing framework/business code outside sprint contract
- changing architecture documents without explicit governance intent

## VIII. Implementation Rules

Dev must follow these rules during implementation:

1. Do not use `process.env` outside configuration boundary.
2. Do not place business logic in infrastructure or shared.
3. Do not create convenience folders outside approved source-tree.
4. Do not add extra runtime patterns not required by Sprint 01.
5. Do not silently modify architecture through code structure.
6. Do not commit build artifacts, `node_modules`, logs, secrets, or real private keys.
7. Keep commits small, coherent, and traceable.

## IX. Acceptance Criteria

This assignment is accepted only when all conditions below are true:

1. `package.json` exists and is normalized for ESM project baseline.
2. `tsconfig.json` exists and strict mode is enabled.
3. lint/format baseline is present and non-conflicting.
4. root-level structure matches approved source-tree.
5. `src` structure matches approved source-tree.
6. no forbidden directory or structural drift is introduced.
7. no boundary violation is introduced.
8. no `process.env` leakage appears outside config layer.
9. no business logic is mixed into this sprint.
10. implementation remains traceable to Phase 01 / Sprint 01 / Tasks 01-04.

## X. Validation Requirements

Before opening PR, Dev must validate at minimum:

- install succeeds
- package manifest is valid
- TypeScript baseline config is syntactically valid
- lint/format commands run as expected
- repository structure matches approved contract
- no unintended files are included

**Suggested evidence:**

- `npm install` completed successfully
- TypeScript config check passed
- lint command passed
- format check passed
- manual structure verification against source-tree completed

## XI. Branch and Commit Rules

**Recommended branch naming:**

- `feature/governance-sprint01-bootstrap`
- `feature/infrastructure-sprint01-bootstrap`

**Commit format must follow:**

```text
<type>(<scope>): <message>
```

**Example commits:**

- `chore(governance): initialize repository baseline`
- `build(config): add strict tsconfig baseline`
- `chore(infrastructure): add source tree skeleton`
- `chore(shared): add lint and prettier baseline`

## XII. Pull Request Requirements

PR must include:

- Phase / Sprint / Task mapping
- objective of the change
- affected areas
- source-of-truth references
- included scope
- explicitly excluded scope
- validation evidence
- risk notes

**PR title example:**

```text
chore(governance): complete phase 01 sprint 01 environment bootstrap baseline
```

**Affected areas example:**

- governance
- config
- infrastructure
- docs
- shared

## XIII. Review Focus for Leader

Leader will review against these points:

- structure matches `source-tree.md`
- no architecture drift is introduced
- no task scope expansion beyond Sprint 01
- no boundary violations
- no hidden business logic
- validation evidence is credible
- PR remains small enough to review safely

**Merge must be blocked if:**

- structure is non-compliant
- contract traceability is missing
- scope silently expands
- tooling config is contradictory
- source-of-truth alignment is broken

## XIV. Required Task Report After Completion

After implementation, Dev must submit a Task Report.

**Task Report must contain:**

### 1. Task identity

- Phase
- Sprint
- Task
- branch name
- PR title

### 2. Source basis used

- list of source-of-truth documents actually applied

### 3. Work completed

- files created
- files updated
- structural changes
- scripts added

### 4. Validation evidence

- commands executed
- result summary
- manual checks performed

### 5. Scope control statement

- what was included
- what was intentionally not done

### 6. Risks / notes

- limitations
- deferred items
- concerns for next sprint

### 7. Handoff recommendation

- what Sprint 02 can start from
- any setup assumptions that must be preserved

## XV. Completion Statement

This task is considered complete only when:

- implementation is done
- validation is done
- PR is opened with full contract traceability
- Task Report is submitted
- Leader review passes
