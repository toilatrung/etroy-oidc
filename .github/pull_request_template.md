## Summary

Describe the change clearly and precisely.

## Context

- Problem being solved:
- Why this change is needed now:
- Related phase / sprint / task:

## Module

- Primary module or layer:
- Secondary modules or layers affected:

## Source-of-Truth / Contract Reference

Mandatory traceability inputs must not be empty.

- Exact source-of-truth documents used:
- API / schema / claim / ADR / architecture note:
- Contract version or decision reference:
- Why these references are sufficient for this change:

## Change Type

- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Docs
- [ ] Chore
- [ ] Test
- [ ] Build

## Scope of Change

- Included scope:
- Explicitly excluded scope:
- Key implementation points:
- Files or areas with highest impact:

## Boundary Check

- [ ] Change stays within the correct module boundary
- [ ] File placement follows `docs/architecture/source-tree.md`
- [ ] Auth does not generate token / OIDC issuance logic
- [ ] OIDC does not bypass approved abstraction to access user DB directly
- [ ] No duplicate identity logic introduced
- [ ] No direct DB field exposure as claim without mapper
- [ ] No business workflow added to `infrastructure`
- [ ] No module-specific workflow added to `shared`

## Security Check

- [ ] No secret committed
- [ ] No sensitive data exposed in logs / responses
- [ ] Passwords are never persisted in plain text if applicable
- [ ] Refresh token handling remains hashed if applicable
- [ ] Session / cookie / CSRF implications reviewed if applicable
- [ ] Security-sensitive behavior reviewed carefully

## Validation

- [ ] Unit tests added or updated, or not applicable with reason
- [ ] Integration tests added or updated, or not applicable with reason
- [ ] Build passes locally
- [ ] Lint passes locally
- [ ] Format check passes locally
- [ ] Typecheck passes locally
- [ ] Manual validation completed where applicable

Validation evidence:

- command: `...`
  - result: `PASS | FAIL | NOT RUN`
  - scope checked:
- command: `...`
  - result: `PASS | FAIL | NOT RUN`
  - scope checked:

Notes:

-

## Breaking Change Assessment

- [ ] No breaking change
- [ ] Breaking change exists and is versioned / approved

Details:

-

## Risk Assessment

- Risk level: `Low | Medium | High`
- Main risks:
- Rollback impact:
- Known limitations or deferred work:

## Reviewer Focus

List the areas where reviewer attention is most needed.

-

## Checklist Before Review Request

- [ ] Branch name follows convention
- [ ] Commit messages follow semantic convention
- [ ] PR title is clear and scoped
- [ ] Contract reference is present and specific
- [ ] Included and excluded scope are clear
- [ ] Validation evidence is reproducible
- [ ] No unrelated code included
- [ ] No placeholder mandatory sections remain
