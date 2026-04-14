## Summary
Describe the change clearly and precisely.

## Context
- Problem being solved:
- Why this change is needed now:
- Related sprint / task:

## Module
- Primary module:
- Secondary modules affected (if any):

## Contract Reference
- API / schema / claim / ADR / architecture note:
- Contract version or decision reference:

## Change Type
- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Chore
- [ ] Test

## Scope of Change
- Key implementation points:
- Files or areas with highest impact:

## Boundary Check
- [ ] Change stays within the correct module boundary
- [ ] Auth does not generate token / OIDC issuance logic
- [ ] OIDC does not bypass approved abstraction to access DB directly
- [ ] No duplicate identity logic introduced
- [ ] No direct DB field exposure as claim without mapper

## Security Check
- [ ] No secret committed
- [ ] No sensitive data exposed in logs / responses
- [ ] Refresh token handling remains hashed if applicable
- [ ] Session / cookie / CSRF implications reviewed if applicable
- [ ] Security-sensitive behavior reviewed carefully

## Testing
- [ ] Unit tests added or updated
- [ ] Integration tests added or updated
- [ ] Build passes locally
- [ ] Lint / format / typecheck pass locally

Testing evidence:
- Commands run:
- Notes:

## Breaking Change Assessment
- [ ] No breaking change
- [ ] Breaking change exists and is versioned / approved

Details:

## Reviewer Focus
List the areas where reviewer attention is most needed.

## Checklist Before Review Request
- [ ] Branch name follows convention
- [ ] Commit messages follow semantic convention
- [ ] PR title is clear and scoped
- [ ] Contract reference is present
- [ ] No unrelated code included
