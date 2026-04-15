# eTroy OIDC - Anti-patterns (Merge-Blocking Reference)

## I. Purpose

This document defines repository-specific anti-patterns that are non-compliant in eTroy OIDC.
It is used for implementation review, PR blocking, and drift prevention.

Rules:

- treat every item here as enforcement guidance, not optional advice
- when conflicts appear, apply `docs/source-of-truth-index.md` precedence
- architecture contracts remain authoritative over planning and operational notes

---

## II. Source-of-Truth and Governance Anti-patterns

### AP-01 - Code-first, contract-later execution

- Anti-pattern name: Code-first, contract-later execution
- What it looks like: implementation begins before approved contracts or references are present.
- Why it is wrong in this project: violates contract-first rules in `master-execution-plan.md` and governance controls.
- Typical review signals: PR has code changes but missing phase/sprint/task and source-of-truth references.
- Required correction: define/approve contract first, then implement, then attach traceable references in PR.

### AP-02 - Silent architecture change

- Anti-pattern name: Silent architecture change
- What it looks like: repository structure or module ownership is changed without updating authoritative docs.
- Why it is wrong in this project: architecture drift is explicitly blocked by source-of-truth and review governance.
- Typical review signals: structural/module changes appear in code while architecture docs remain unchanged.
- Required correction: update architecture contracts first (or in controlled change set), then implement.

### AP-03 - Agent files overriding authoritative docs

- Anti-pattern name: Agent-over-docs authority inversion
- What it looks like: implementation decisions are justified from `agent/` content when `docs/` says otherwise.
- Why it is wrong in this project: `docs/` is authoritative; `agent/` is support only.
- Typical review signals: rationale cites `agent/current-context.md` as contract source.
- Required correction: align implementation to `docs/`; keep `agent/` files as operational notes only.

### AP-04 - Governance bypass

- Anti-pattern name: PR/governance bypass
- What it looks like: direct pushes to protected branches, no PR review, or unresolved merge-blockers ignored.
- Why it is wrong in this project: governance documents define merge-blocking workflow as mandatory.
- Typical review signals: missing PR trail, direct merge, unresolved critical comments.
- Required correction: restore branch/PR/review flow and enforce merge-blocking checklist before merge.

---

## III. Repository Structure Anti-patterns

### AP-05 - Ad-hoc directories outside approved structure

- Anti-pattern name: Ad-hoc structure growth
- What it looks like: new runtime folders/layers added outside approved root and `src/` structure.
- Why it is wrong in this project: violates `source-tree.md` physical contract.
- Typical review signals: folders appear with no architectural decision and no contract update.
- Required correction: remove non-approved directories or approve architecture change first.

### AP-06 - Temporary/personal artifacts in product source

- Anti-pattern name: Source-tree contamination
- What it looks like: temporary notes, personal files, or throwaway artifacts committed in product areas.
- Why it is wrong in this project: breaks repository hygiene and review clarity.
- Typical review signals: unrelated local artifacts in `src/`, `docs/`, or runtime paths.
- Required correction: remove artifacts and keep product areas contract-aligned.

---

## IV. Config Layer Anti-patterns

### AP-07 - Direct `process.env` access outside `src/config/`

- Anti-pattern name: Config boundary bypass
- What it looks like: modules/infrastructure/app read `process.env` directly.
- Why it is wrong in this project: `config` must encapsulate environment input and normalization.
- Typical review signals: `process.env` matches outside `src/config/`.
- Required correction: route all environment reads through `src/config/` typed exports.

### AP-08 - Non-fail-fast configuration validation

- Anti-pattern name: Deferred configuration failure
- What it looks like: startup continues with invalid/missing required env values.
- Why it is wrong in this project: Sprint 02 and phase rules require immediate fail-fast startup behavior.
- Typical review signals: app boot succeeds with invalid config or uses silent fallback.
- Required correction: enforce startup validation that throws immediately with variable-level errors.

### AP-09 - Duplicated env parsing and normalization

- Anti-pattern name: Split config logic across arbitrary files
- What it looks like: multiple modules parse env values or reshape config independently.
- Why it is wrong in this project: breaks centralized typed config contract and deterministic behavior.
- Typical review signals: repeated parsing/default logic in non-config files.
- Required correction: keep schema, env loading/validation, and normalized export centralized in `src/config/`.

### AP-10 - Non-approved Sprint 02 config shape

- Anti-pattern name: Unapproved config structure substitution
- What it looks like: replacing `schema.ts`/`env.ts`/`config.ts` with unapproved nested structure.
- Why it is wrong in this project: violates current Sprint 02 assignment contract and repository structure alignment.
- Typical review signals: `src/config/` contains replacement subfolders used as active contract.
- Required correction: restore active contract files `src/config/schema.ts`, `src/config/env.ts`, `src/config/config.ts`.

---

## V. Module Boundary Anti-patterns

### AP-11 - `auth` generating tokens

- Anti-pattern name: Auth-to-token ownership violation
- What it looks like: token issuance logic exists in `auth`.
- Why it is wrong in this project: token lifecycle ownership belongs to `oidc`.
- Typical review signals: token signing/issuance code in `modules/auth`.
- Required correction: move token issuance to `modules/oidc`; keep `auth` for credential validation only.

### AP-12 - `oidc` directly querying ownership user data in DB

- Anti-pattern name: OIDC direct user-ownership access
- What it looks like: `oidc` accesses user ownership storage directly instead of approved `users` contracts.
- Why it is wrong in this project: violates module ownership and dependency rules.
- Typical review signals: direct user model/repository queries from `modules/oidc`.
- Required correction: consume user data through approved `users` service/account contracts.

### AP-13 - Cross-module ownership bypass and logic duplication

- Anti-pattern name: Ownership bypass and duplicate policy
- What it looks like: module reimplements another module's ownership logic or imports internals directly.
- Why it is wrong in this project: boundary and single-ownership principles are broken.
- Typical review signals: duplicated validation/policy code across modules; direct internal imports.
- Required correction: keep one owner per responsibility and call through approved contracts only.

---

## VI. Infrastructure Anti-patterns

### AP-14 - Business logic inside `infrastructure`

- Anti-pattern name: Infrastructure business orchestration
- What it looks like: domain decisions/workflows implemented in infrastructure adapters.
- Why it is wrong in this project: infrastructure is integration layer, not business policy owner.
- Typical review signals: use-case policy branching in `src/infrastructure/*`.
- Required correction: move business workflows to owning modules; keep infrastructure adapter-focused.

### AP-15 - Unapproved direct low-level dependency access

- Anti-pattern name: Abstraction bypass for external systems
- What it looks like: business modules call raw external libraries directly where infrastructure abstractions exist.
- Why it is wrong in this project: introduces hidden coupling and boundary erosion.
- Typical review signals: direct mail/crypto/logging provider calls in domain modules.
- Required correction: route external operations through approved infrastructure abstractions.

---

## VII. Shared Layer Anti-patterns

### AP-16 - `shared` as dumping ground for domain workflows

- Anti-pattern name: Shared-layer domain leakage
- What it looks like: module-specific workflows/policies placed in `src/shared/`.
- Why it is wrong in this project: `shared` is for cross-cutting primitives, not domain ownership.
- Typical review signals: flow/use-case functions in `shared` tied to one domain.
- Required correction: move workflow logic to owning module; keep `shared` generic and reusable.

---

## VIII. Runtime Stability and Startup Anti-patterns

### AP-17 - Placeholder startup treated as complete

- Anti-pattern name: Placeholder completeness claim
- What it looks like: TODO/stub startup paths are reported as done without runnable verification.
- Why it is wrong in this project: baseline must be production-oriented and stable by phase criteria.
- Typical review signals: placeholder entry paths with no validated runtime behavior.
- Required correction: mark limitations explicitly and keep completion claims tied to runnable evidence.

### AP-18 - Non-runnable baseline accepted as done

- Anti-pattern name: Non-runnable done-state
- What it looks like: PR claims completion while startup/validation cannot be executed successfully.
- Why it is wrong in this project: definition-of-done and quality gates require runnable validated state.
- Typical review signals: claimed completion with missing or failing startup evidence.
- Required correction: provide reproducible runtime validation and block merge until baseline runs.

### AP-19 - Known critical instability left undocumented

- Anti-pattern name: Hidden critical instability
- What it looks like: known startup/security/architecture instability is not recorded in report/context.
- Why it is wrong in this project: removes traceability and undermines risk review.
- Typical review signals: reviewers discover major caveats not declared in PR/report notes.
- Required correction: record critical instability in task report and operational context immediately.

---

## IX. Security-critical Anti-patterns

### AP-20 - Raw refresh token persistence

- Anti-pattern name: Raw refresh token storage
- What it looks like: refresh tokens persisted unhashed.
- Why it is wrong in this project: explicitly forbidden by architecture and execution plan security rules.
- Typical review signals: plaintext refresh token writes in persistence layer.
- Required correction: hash refresh tokens before persistence and enforce rotation/revoke behavior by contract.

### AP-21 - Unsafe secret leakage in logs/errors

- Anti-pattern name: Secret disclosure through diagnostics
- What it looks like: sensitive values echoed in logs, validation messages, or error payloads.
- Why it is wrong in this project: violates defensive security handling and review checklist expectations.
- Typical review signals: credentials/tokens/full secrets visible in console/log output.
- Required correction: redact sensitive values; keep errors actionable without exposing secrets.

---

## X. PR and Review Anti-patterns

### AP-22 - PR without contract/source-of-truth references

- Anti-pattern name: Untraceable PR basis
- What it looks like: PR omits contract references and source-of-truth alignment.
- Why it is wrong in this project: traceability is mandatory and merge-blocking.
- Typical review signals: missing phase/sprint/task links and missing core doc references.
- Required correction: include objective, scope, contract references, risk notes, and validation evidence.

### AP-23 - Mixed unrelated scope in one PR

- Anti-pattern name: Scope mixing
- What it looks like: one PR combines unrelated module/phase/governance changes without explicit control.
- Why it is wrong in this project: reduces review quality and increases merge risk.
- Typical review signals: unrelated file clusters and objectives in same PR.
- Required correction: split into coherent PRs with explicit included/excluded scope.

### AP-24 - Validation claims without credible evidence

- Anti-pattern name: Evidence-free validation claim
- What it looks like: PR states checks passed but provides no reproducible outputs or consistent status.
- Why it is wrong in this project: review-checklist requires credible validation evidence.
- Typical review signals: checklist marked complete with missing command results or contradictory statuses.
- Required correction: attach command-based evidence reviewers can reproduce or trust.

---

## XI. Review Usage

During review, if any anti-pattern above is present and unresolved:

- request changes or reject PR
- require explicit correction and re-validation evidence
- do not merge on assumptions
