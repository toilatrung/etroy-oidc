# eTroy OIDC - Pull Request Template Governance

---

## I. Purpose

This document defines the governance rules for pull request content in eTroy OIDC.

The single active PR template file is:

- `.github/pull_request_template.md`

Do not duplicate the full template body in this document. If the PR template changes, update `.github/pull_request_template.md` directly and keep this governance file focused on review rules.

---

## II. Authority

`docs/governance/pr-template.md` is the governance reference.

`.github/pull_request_template.md` is the executable GitHub template used when opening PRs.

If the two conflict:

1. apply `docs/source-of-truth-index.md`
2. preserve the governance requirements in this document
3. update `.github/pull_request_template.md` so the active template satisfies governance

---

## III. Mandatory PR Content

Every meaningful PR must include:

- clear summary
- problem and timing context
- related phase, sprint, and task when applicable
- primary module or layer
- secondary modules or layers affected, if any
- exact source-of-truth and contract references
- included scope
- explicitly excluded scope
- key implementation points
- boundary check
- security check
- validation evidence with exact commands and PASS, FAIL, or NOT RUN results
- breaking change assessment
- risk and rollback notes
- reviewer focus
- final checklist before review request

---

## IV. Merge-Blocking Rules

Block merge if any of these conditions are present:

- mandatory PR sections are blank, placeholder-only, contradictory, or non-reproducible
- source-of-truth reference is missing
- phase, sprint, or task reference is missing for planned work
- contract basis is vague or generic
- included or excluded scope is missing
- validation evidence is missing for meaningful implementation
- validation claims do not include exact commands and results
- boundary violation exists
- auth generates token or OIDC issuance logic
- OIDC directly accesses user ownership data in the database
- duplicate identity logic is introduced
- raw refresh token storage is introduced
- direct DB field exposure as claim bypasses mapper rules
- business workflow is added to `infrastructure`
- module-specific workflow is added to `shared`
- security-sensitive behavior lacks review notes
- breaking change exists without approval or versioning
- unrelated code is included

---

## V. Maintenance Rule

When governance requirements change:

1. update this file with the rule change
2. update `.github/pull_request_template.md` only if the active PR form must change
3. verify the template still captures all mandatory review information

The project should maintain one full PR template body only: `.github/pull_request_template.md`.
