# eTroy OIDC — Repository Governance Rules

---

## I. Purpose

This document defines the Git operating rules for the eTroy OIDC repository in order to:

- protect system architecture
- prevent broken mainline branches
- standardize team workflow
- support review, traceability, and rollback

Git workflow in this project is not just a source control convention. It is part of the governance layer.

---

## II. Scope

This document applies to the entire eTroy OIDC repository, including:

- all modules
- all roles: Leader, Dev, Tester/BA
- all change types: feature, fix, refactor, docs, cleanup, governance

---

## III. Core Principles

### 1. PR-based development only

Direct commits to primary branches are forbidden.

All meaningful changes must go through:

- a working branch
- a pull request
- review
- merge after approval

---

### 2. Contract-first before code

No implementation PR may be opened when:

- the contract does not exist
- the contract has not been approved
- architecture changes are not reflected in source-of-truth documents

---

### 3. Architecture protection over speed

If delivery speed conflicts with architectural correctness:

- architecture wins
- the PR must be rejected if it violates boundaries or source of truth

---

### 4. Traceability is mandatory

Every commit and every PR must be traceable to:

- phase / sprint / task
- module ownership
- relevant source documents

---

## IV. Branching Strategy

### 1. Main branches

#### `main`

- most stable branch
- contains only reviewed and validated code
- direct push is forbidden

#### `develop`

- primary integration branch for development
- accepts only valid PR merges
- direct push is forbidden unless explicitly allowed by governance policy

---

### 2. Working branches

#### Feature branch

Naming format:

- `feature/<module>-<short-name>`

Examples:

- `feature/auth-register-flow`
- `feature/users-profile-update`

#### Fix branch

Naming format:

- `fix/<module>-<short-name>`

Examples:

- `fix/config-env-validation`
- `fix/oidc-pkce-check`

#### Hotfix branch

Naming format:

- `hotfix/<short-name>`

Use only for urgent fixes affecting stable integration or production baseline.

#### Docs branch

Naming format:

- `docs/<short-name>`

Examples:

- `docs/update-srs-v1`
- `docs/refine-module-boundaries`

---

## V. Commit Rules

### 1. Commit principles

Commits must be:

- small
- logically coherent
- clearly named
- easy to review

Do not:

- commit temporary files
- commit build artifacts
- commit sensitive generated material
- use meaningless commit messages such as `fix`, `update`, `temp`, or `test`

---

### 2. Commit message format

Required format:

- `<type>(<scope>): <message>`

#### Allowed types

- `feat`
- `fix`
- `refactor`
- `docs`
- `test`
- `chore`
- `build`

#### Allowed scopes

Scopes should reflect the affected module or system area, such as:

- `auth`
- `users`
- `verification`
- `password-reset`
- `oidc`
- `admin`
- `audit`
- `health`
- `config`
- `infrastructure`
- `shared`
- `docs`
- `governance`

#### Examples

- `feat(users): add profile update service stub`
- `fix(config): tighten env validation`
- `docs(architecture): refine source-tree contract`
- `refactor(oidc): split provider bootstrap placeholder`

---

## VI. Pull Request Rules

### 1. Every meaningful change requires a PR

All meaningful changes must go through a PR, including:

- feature work
- fixes
- refactors
- source-of-truth documentation changes
- structural cleanup

---

### 2. Every PR must include

Each PR must include:

- objective of the change
- affected module
- source-of-truth references
- contract references
- risk notes
- validation or test evidence

---

### 3. Every PR must stay within scope

A PR should address one coherent logical change set.

Do not:

- mix unrelated changes across modules
- combine architecture refactor and large business feature work without explicit justification
- merge multiple phase tasks into one PR without clear control

---

## VII. Protected Branch Rules

### 1. `main`

Required protections:

- require pull request
- require review approval
- require status checks
- block direct push
- block force push

---

### 2. `develop`

Required protections:

- require pull request
- require status checks
- block direct push unless governance explicitly allows otherwise

---

## VIII. Merge Rules

### 1. Merge is allowed only when

A PR may be merged only when:

- module ownership is correct
- module boundaries are respected
- source-tree rules are respected
- quality gates pass
- review is completed
- no critical unresolved review comments remain

---

### 2. Merge must be blocked when

A PR must be rejected or blocked when:

- auth generates token
- oidc accesses user ownership data directly in the database
- refresh token is stored raw
- identity logic is duplicated
- source-of-truth docs are not updated for architectural change
- the PR has no contract reference

---

## IX. File Hygiene Rules

The following must not be committed:

- `node_modules/`
- `dist/`
- log files
- temporary files
- unnecessary IDE noise
- real private keys
- generated compiled `.js` / `.map` files in source areas unless explicitly approved by project strategy

---

## X. Documentation Governance Rules

If a PR changes any of the following files, it must be reviewed at architectural level:

- `docs/architecture/system-overview.md`
- `docs/architecture/module-boundaries.md`
- `docs/architecture/source-tree.md`
- `docs/architecture/detailed-source-tree.md`
- `docs/requirements/srs-v1.md`
- `docs/planning/master-execution-plan.md`

Changes to these files are governance or architecture changes, not ordinary documentation edits.

---

## XI. Review Responsibility

### Leader

Responsible for:

- architecture review
- boundary validation
- contract alignment
- final accept/reject decision for source-of-truth affecting PRs

### Dev

Responsible for:

- implementation correctness
- detecting duplicate logic
- detecting structural code smell

### Tester / BA

Responsible for:

- requirement traceability review
- acceptance criteria review
- validation evidence review

---

## XII. Git-level Definition of Done

A change is complete at Git level when:

- it is developed on a valid branch
- commit messages follow convention
- the PR contains all required information
- review is completed
- merge respects governance
- the change is traceable to task / contract / source of truth

---

## XIII. Violations

The following are considered serious violations:

- pushing directly to `main`
- bypassing PR workflow
- merging without review
- changing architecture in code without updating source documents
- keeping legacy compatibility wrappers against approved structure
- committing sensitive material

---

## XIV. Conclusion

Repository Governance Rules provide the minimum control required to ensure the repository does not drift away from the approved architecture.

Without enforcement:

- boundaries will erode
- source of truth will lose authority
- primary branches will accumulate structural defects
