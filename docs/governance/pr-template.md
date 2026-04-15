# eTroy OIDC — Mandatory Pull Request Contract

---

## I. Pull Request Information

> Merge-blocking rule: PRs with placeholder or empty mandatory sections are non-compliant (AP-22/AP-24) and must not be approved.

### Title

<!-- Recommended format:
<type>(<scope>): <short summary> -->

### Change Type

- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Docs
- [ ] Test
- [ ] Chore
- [ ] Build

### Affected Module

- [ ] auth
- [ ] users
- [ ] verification
- [ ] password-reset
- [ ] oidc
- [ ] admin
- [ ] audit
- [ ] health
- [ ] config
- [ ] infrastructure
- [ ] shared
- [ ] docs
- [ ] governance

---

## II. Context

### Related Phase / Sprint / Task

<!-- Example:
Phase 01 / Sprint 01 / Task 03 -->

### Problem Statement

Describe the problem this PR addresses.

### Objective

Describe the intended outcome of this PR.

---

## III. Source of Truth References

### Mandatory Traceability Inputs (must not be empty)

- Phase / Sprint / Task: `...`
- Exact source-of-truth docs used: `...`
- Contract clauses implemented: `...`
- Why these references are sufficient for this change: `...`

### Relevant Documents

List all relevant documents used as implementation source:

- [ ] `docs/architecture/system-overview.md`
- [ ] `docs/architecture/module-boundaries.md`
- [ ] `docs/architecture/source-tree.md`
- [ ] `docs/architecture/detailed-source-tree.md`
- [ ] `docs/requirements/srs-v1.md`
- [ ] `docs/planning/master-execution-plan.md`
- [ ] other: `...`

### Contract Reference

Describe the contract or design basis for this change.

Do not leave this section blank. Generic statements like "aligned with docs" are non-compliant.

---

## IV. Scope of Change

### Included in this PR

List what is included.

### Explicitly excluded from this PR

List what is intentionally out of scope.

This section is mandatory to prevent uncontrolled PR expansion.

---

## V. Implementation Summary

Describe what was changed at implementation level.

Suggested structure:

- files added
- files modified
- files removed
- structural changes
- logic changes

---

## VI. Architectural Alignment

### Boundary Check

Confirm the following:

- [ ] This PR respects `module-boundaries.md`
- [ ] This PR respects `source-tree.md`
- [ ] This PR does not introduce duplicate logic
- [ ] This PR does not bypass approved layers
- [ ] This PR does not violate data ownership

### Critical Rules Check

- [ ] Auth does not generate token
- [ ] OIDC does not directly query user ownership data in the database
- [ ] Refresh token is not stored raw
- [ ] Client identity is not duplicated outside identity source

---

## VII. Validation Evidence

### Validation Performed

- [ ] Typecheck
- [ ] Build
- [ ] Unit test
- [ ] Integration test
- [ ] Manual validation
- [ ] Docs review

### Evidence

Provide short evidence or command output summary.

Example:

- `tsc --noEmit` passed
- local build passed
- manual route check passed

Minimum required evidence format:

- command: `<exact command>`
- result: `PASS` or `FAIL`
- scope checked: `<what this command validated>`

If evidence is omitted, non-reproducible, or contradictory, the PR is merge-blocked.

---

## VIII. Risk Assessment

### Risk Level

- [ ] Low
- [ ] Medium
- [ ] High

### Risk Description

Describe the main risks of this change.

### Rollback Impact

Describe what would need to be reverted if this PR fails after merge.

---

## IX. Reviewer Notes

### Areas requiring careful review

List any part reviewers should inspect closely.

### Known limitations

List any current limitations that are intentionally deferred.

---

## X. Final Confirmation

By opening this PR, the author confirms:

- [ ] The change is traceable to approved context
- [ ] The change stays within declared scope
- [ ] The change respects architecture and source of truth
- [ ] The validation evidence provided is accurate
- [ ] Mandatory traceability and evidence sections are fully completed (no placeholders, no empty required fields)
