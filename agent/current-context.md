# eTroy OIDC - Current Context

## I. Purpose

This file captures the current operational state of the project for fast session continuity.
It summarizes approved state and next actions without redefining architecture.

## II. Current Project State

- Documentation authority model is established and active.
- Architecture, requirements, planning, and governance documents are present in `docs/`.
- Phase 01 / Sprint 01 bootstrap baseline is implemented and validation-ready:
  - ESM + TypeScript strict baseline present
  - ESLint + Prettier baseline configured
  - required root and `src` skeleton verified
  - baseline lint/typecheck/format checks passing

## III. Active Source of Truth

Authoritative layer: `docs/`
Operational support layer: `agent/` (non-authoritative)

Primary references for all implementation and review decisions:

- `docs/source-of-truth-index.md`
- `docs/README.md`
- architecture contracts
- requirements contract
- planning controls
- governance controls

## IV. Current Phase and Sprint

- Current phase: Phase 01 - Environment and Infrastructure Foundation
- Current sprint focus: Sprint 01 - Environment Bootstrap
- Sprint 01 status: bootstrap baseline implementation completed in-session; ready for review/handoff

## V. Current Priorities

- maintain strict source-of-truth governance
- preserve boundary-safe bootstrap baseline
- keep changes traceable to phase/sprint/task contracts
- prepare transition to Sprint 02 (Config Distribution) under approved plan

## VI. Recent Approved Decisions

- `docs/` confirmed as the authoritative documentation layer.
- `agent/` confirmed as operational support only.
- `source-tree.md` confirmed as primary over `detailed-source-tree.md`.
- contract-first and architecture enforcement rules remain mandatory.

## VII. Deferred or Pending Items

- advanced features outside current scope (social login, MFA, external federation) remain deferred per SRS.
- post-Sprint-01 progression remains controlled by phase planning and governance review.

## VIII. Immediate Next Actions

1. prepare Sprint 01 PR package with contract traceability and validation evidence
2. keep scope locked while transitioning to Sprint 02 planning
3. maintain governance checklist enforcement at review time
4. record subsequent transitions in `agent/session-history.md`

## IX. Notes for the Next Session

- Continue using source-of-truth reading order.
- Treat undocumented structural or architectural changes as invalid until approved.
- In this environment, prefer `npm.cmd` over `npm` due PowerShell policy restrictions.
