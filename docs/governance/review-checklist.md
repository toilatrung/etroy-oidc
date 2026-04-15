# eTroy OIDC — Merge Blocking Review Checklist

---

## I. Purpose

This checklist is used to determine whether a pull request may be merged.

It is a merge-blocking checklist, not a suggestion list.

If any critical item fails, the PR must be rejected or returned for correction.

---

## II. Review Categories

Every PR must be reviewed across these categories:

- scope control
- source-of-truth alignment
- architecture compliance
- implementation quality
- validation evidence
- risk and merge readiness

---

## III. Scope Control

### 1. Is the PR scoped correctly?

- [ ] The PR addresses one coherent change set
- [ ] The PR does not mix unrelated modules without justification
- [ ] The PR does not silently expand beyond declared objective
- [ ] Included and excluded scope are clearly stated

### 2. Is the PR traceable?

- [ ] Phase / sprint / task is identified
- [ ] Relevant source documents are referenced
- [ ] Contract basis is stated
- [ ] PR template mandatory traceability inputs are fully filled (no placeholders)

If traceability is missing, block merge.

---

## IV. Source-of-Truth Alignment

- [ ] The PR aligns with `system-overview.md`
- [ ] The PR aligns with `module-boundaries.md`
- [ ] The PR aligns with `source-tree.md`
- [ ] The PR aligns with `srs-v1.md`
- [ ] Architectural or governance changes update the relevant docs

If implementation changes architecture without updating source-of-truth documents, block merge.

---

## V. Architecture Compliance

### 1. Boundary compliance

- [ ] Module ownership is correct
- [ ] No forbidden dependency is introduced
- [ ] No layer bypass is introduced
- [ ] No duplicate logic is introduced across modules

### 2. Critical architectural violations

- [ ] Auth does not generate token
- [ ] OIDC does not directly access user ownership data in the database
- [ ] Refresh token is not stored raw
- [ ] Identity is not duplicated outside identity source
- [ ] Shared is not used as a dumping ground for domain logic
- [ ] Infrastructure does not contain business logic

If any critical violation exists, reject PR.

---

## VI. Implementation Quality

- [ ] Naming is clear and consistent
- [ ] File placement matches approved structure
- [ ] The implementation is not over-coupled
- [ ] No unnecessary compatibility wrapper is introduced
- [ ] No dead code or obvious placeholder leakage remains unintentionally
- [ ] Error handling follows project conventions
- [ ] Sensitive operations are handled defensively

---

## VII. Validation and Evidence

- [ ] Validation steps are listed
- [ ] Provided evidence is credible
- [ ] Typecheck/build/test status is consistent with claimed results
- [ ] Reviewer can reproduce or trust the stated verification basis
- [ ] Evidence includes exact commands plus explicit PASS/FAIL outcomes
- [ ] Validation section is not left with template placeholder text

If validation evidence is missing for a risky change, block merge.

---

## VIII. Security Review

- [ ] No obvious credential leakage
- [ ] No raw secret persistence
- [ ] No unsafe token handling
- [ ] No obvious authentication or session misuse
- [ ] No high-risk security regression introduced by the change

If security handling is unsafe, reject PR immediately.

---

## IX. Risk Review

- [ ] Risk level is declared
- [ ] Main risks are identified
- [ ] Rollback impact is understood
- [ ] Merge timing is acceptable for the risk level

If risk is high and mitigation is absent, block merge.

---

## X. Merge Decision

### Approve only if all are true

- [ ] Scope is correct
- [ ] Traceability is complete
- [ ] Source-of-truth alignment is valid
- [ ] Architecture compliance is valid
- [ ] Validation evidence is acceptable
- [ ] Security review is clean
- [ ] Risk is acceptable

---

## XI. Block Merge Conditions

Merge must be blocked if any of the following occurs:

- missing contract reference
- missing source-of-truth alignment
- placeholder or empty mandatory PR template sections
- boundary violation
- forbidden dependency
- duplicate identity logic
- raw refresh token storage
- auth generating token
- oidc directly querying user ownership data
- unreviewed architecture change
- missing validation for meaningful implementation
- non-reproducible or placeholder-only validation evidence
- unresolved critical review comments

---

## XII. Reviewer Conclusion

### Decision

- [ ] Approve
- [ ] Request changes
- [ ] Reject

### Review Notes

Write concise review notes here.
