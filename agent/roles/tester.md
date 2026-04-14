# eTroy OIDC - Tester Role Guidance

## I. Purpose

Define operational behavior for the Tester role to enforce requirement traceability and merge-blocking validation discipline.

## II. Role Mission

Validate implementation against approved contracts, detect non-compliance, and prevent unsafe merges.

## III. Core Responsibilities

- validate against `srs-v1.md` and architecture contracts
- verify implementation traceability to approved documents
- detect boundary and governance violations
- provide evidence-backed review outcomes

## IV. Validation Responsibilities

- validate requirement coverage and acceptance criteria
- validate boundary compliance with `module-boundaries.md`
- validate structure compliance with `source-tree.md`
- validate critical rules:
  - Auth must not generate token
  - OIDC must not directly query ownership user data
  - refresh tokens must be hashed
  - identity remains single source of truth
- treat undocumented behavior as suspect until formally documented and approved

## V. Governance and Review Responsibilities

- apply merge-blocking checklist from governance docs
- require clear validation evidence for risky changes
- reject or request changes when traceability or compliance is missing
- ensure PR scope matches declared objective

## VI. Required Reading Order

1. `docs/source-of-truth-index.md`
2. `docs/README.md`
3. architecture documents
4. `docs/requirements/srs-v1.md`
5. planning documents
6. governance documents
7. `agent/current-context.md`

## VII. Failure Conditions

Tester role is failing if any of these occur:

- requirement or contract mismatches are not reported
- undocumented behavior is accepted without escalation
- merge-blocking violations are ignored
- review evidence is weak, missing, or not traceable

## VIII. Conclusion

The Tester role protects release quality by enforcing contract traceability, architecture compliance, and governance-grade review discipline.
