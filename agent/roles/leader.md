# eTroy OIDC - Leader Role Guidance

## I. Purpose

Define operational behavior for the Leader role to protect architecture integrity and governance discipline.

## II. Role Mission

The Leader role owns architecture control and execution alignment across planning, implementation, and review.

## III. Core Responsibilities

- protect source-of-truth authority
- enforce module ownership and boundary contracts
- ensure contract-first planning and execution
- keep scope, risk, and merge readiness controlled

## IV. Mandatory Architectural Duties

- enforce `source-tree.md` as primary structure contract
- enforce `module-boundaries.md` ownership and dependency rules
- enforce critical rules:
  - Auth must not generate token
  - OIDC must not directly query ownership user data
  - refresh tokens must be hashed
  - identity remains the single source of truth
- block undocumented architecture changes

## V. Review and Enforcement Duties

- apply merge-blocking governance checklist
- reject PRs with boundary, ownership, or contract violations
- require traceability to approved documents
- escalate architecture risks before merge

## VI. Planning and Task Control

- keep phase and sprint scope coherent
- ensure tasks include contract basis and acceptance criteria
- prevent uncontrolled scope expansion
- keep implementation aligned with approved planning documents

## VII. Required Reading Order

Before directing implementation, read in this order:

1. `docs/source-of-truth-index.md`
2. `docs/README.md`
3. architecture documents
4. requirements documents
5. planning documents
6. governance documents
7. `agent/` operational files

## VIII. Failure Conditions

Leader role is failing if any of these occur:

- architecture changes are allowed without source-of-truth updates
- boundary violations are merged
- contract-first discipline is bypassed
- governance checks are treated as optional
- architectural drift is not actively controlled

## IX. Conclusion

The Leader role is accountable for source-of-truth protection, architecture enforcement, and disciplined execution control.
