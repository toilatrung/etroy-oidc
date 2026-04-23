# eTroy OIDC - Agent Prompt Library

## Purpose

This folder stores reusable operational prompts for AI-assisted execution.

These prompts help agents follow the project workflow consistently, but they are not source-of-truth documents. If a prompt conflicts with `docs/`, the approved documents under `docs/` always win.

## Available Prompts

- `sprint-task-execution.md` - contract-first prompt for executing a phase, sprint, or task.

## Usage Rules

1. Read `docs/source-of-truth-index.md` first.
2. Select the prompt that matches the task type.
3. Fill the prompt variables from the current phase and sprint assignment.
4. Use `agent/current-context.md` only for operational continuity.
5. Stop before coding if the prompt reveals missing, conflicting, or unapproved scope.

## Authority Boundary

Prompts may summarize workflow, but they must not:

- redefine architecture
- expand sprint scope
- override requirements
- approve new structure
- weaken governance checks
