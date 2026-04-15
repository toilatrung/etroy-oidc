# eTroy OIDC - Documentation Guide

## I. Purpose

This file is the main documentation entry point for humans and AI agents.
It explains where to start, how documents are organized, and how to follow the source-of-truth hierarchy.

## II. Documentation Structure

### 1. Architecture

Location: `docs/architecture/`

Purpose: define system design, boundary enforcement, and physical repository contracts.

### 2. Requirements

Location: `docs/requirements/`

Purpose: define required behavior, scope boundaries, and acceptance criteria.

### 3. Planning

Location: `docs/planning/`

Purpose: define execution control, phases, and sprint-level operational sequencing.

### 4. Governance

Location: `docs/governance/`

Purpose: define repository control, PR discipline, and merge-blocking review rules.

## III. Recommended Reading Paths

### 1. For architecture understanding

Read:

1. `docs/source-of-truth-index.md`
2. `docs/architecture/system-overview.md`
3. `docs/architecture/module-boundaries.md`
4. `docs/architecture/source-tree.md`
5. `docs/architecture/detailed-source-tree.md`

### 2. For implementation work

Read:

1. `docs/source-of-truth-index.md`
2. architecture documents
3. `docs/requirements/srs-v1.md`
4. `docs/planning/master-execution-plan.md`
5. current phase file in `docs/planning/phases/`

### 3. For repository governance and review

Read:

1. `docs/source-of-truth-index.md`
2. `docs/governance/git-rules.md`
3. `docs/governance/pr-template.md`
4. `docs/governance/review-checklist.md`
5. `docs/governance/anti-patterns.md`

### 4. For AI agent loading

Load in this sequence:

1. `docs/source-of-truth-index.md`
2. this file (`docs/README.md`)
3. architecture contracts
4. requirements contract
5. planning controls
6. governance controls
7. `agent/` operational context files

## IV. Source-of-Truth Notes

- `docs/source-of-truth-index.md` is the authority file for documentation precedence.
- `docs/` is authoritative.
- `agent/` is operational support and must not redefine architecture or requirements.
- `source-tree.md` is primary.
- `detailed-source-tree.md` is supporting detail only.

## V. Document Map

- `system-overview.md` -> high-level architecture and system role
- `module-boundaries.md` -> module ownership and dependency rules
- `source-tree.md` -> primary physical structure contract
- `detailed-source-tree.md` -> supporting file-level detail reference
- `srs-v1.md` -> requirements contract
- `master-execution-plan.md` -> execution control model
- `phase-01-environment-bootstrap.md` -> current phase breakdown
- `phase-01-sprint-01-report.md` -> sprint execution report
- governance documents -> repository control and merge discipline
- `anti-patterns.md` -> merge-blocking anti-pattern reference aligned with architecture and governance

## VI. Maintenance Rules

- Keep documents aligned with approved authority order.
- Update contracts before implementation changes.
- Do not introduce undocumented architecture changes.
- Keep markdown render-safe and terminology consistent.
- Treat governance and source-of-truth changes as review-critical.

## VII. Conclusion

This guide keeps the documentation set navigable, enforceable, and operationally reliable for both humans and AI agents.
