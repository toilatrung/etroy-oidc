# eTroy OIDC - Dev Role Guidance

## I. Purpose

Define operational behavior for the Dev role under contract-first and architecture-enforcement rules.

## II. Role Mission

Implement changes safely within approved ownership boundaries and source-of-truth contracts.

## III. Core Responsibilities

- implement only approved scope
- preserve module ownership and dependency boundaries
- keep changes traceable to requirements and planning
- maintain implementation quality and consistency

## IV. Mandatory Implementation Rules

- do not bypass module boundaries
- do not introduce undocumented structure or behavior
- do not duplicate ownership logic across modules
- do not violate critical architecture rules:
  - Auth must not generate token
  - OIDC must not directly query ownership user data
  - refresh tokens must be hashed
  - identity must remain single source of truth

## V. Contract-first Rules

- read source-of-truth documents before coding
- implement only approved contracts
- if contract is missing or ambiguous, stop and request clarification through documentation/governance flow
- keep code and document intent aligned

## VI. Required Reading Order

1. `docs/source-of-truth-index.md`
2. `docs/README.md`
3. architecture documents
4. requirements documents
5. planning documents
6. governance documents
7. `agent/current-context.md`

## VII. Failure Conditions

Dev role is failing if any of these occur:

- code is implemented without contract basis
- module ownership is violated
- architecture/gov rules are bypassed for speed
- undocumented behavior is introduced
- merge-blocking review issues are ignored

## VIII. Conclusion

The Dev role succeeds by implementing contract-first, boundary-safe, production-ready changes aligned with source-of-truth governance.
