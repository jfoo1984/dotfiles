---
name: review-lenses
description: Shared library of code-review lens prompts read by review-code, implement-task-with-review, and the PR bot; not invoked directly.
---

# review-lenses

This is a shared library — not a skill you invoke. Consumers (the `review-code` skill, `implement-task-with-review`, and the PR bot) load individual lens files and dispatch them as subagents.

## Pure-reporter rule

**Lenses are pure reporters.** Every lens analyzes the target, emits findings, and returns a verdict — it never edits, stages, commits, or posts.

## Lens families

### Language-agnostic (always eligible)

These lenses apply to any target regardless of language or stack.

| Lens | File | Concern |
|------|------|---------|
| Code quality | `lenses/code-quality.md` | Line-specific: naming, edge cases, error handling, types, dead code, comments |
| Staff engineer | `lenses/staff-engineer.md` | Architectural: right abstraction, coupling traps, future-reader surprise, sleep-losers |
| Test coverage | `lenses/test-coverage.md` | Are new/changed logic and critical paths tested, and are the tests meaningful? Default on any PR that changes source code |
| Adversarial | `lenses/adversarial.md` | Refute-posture correctness attack — tries to break invariants/guards/state-transitions; measured tone (opt-in) |

### Stack-specific (auto-selected by changed-file path)

These lenses are added automatically when the diff touches the matching paths.

| Lens | File | Path trigger |
|------|------|-------------|
| Frontend | `lenses/frontend.md` | `js/apps/fleetweb/**` and other rendered surfaces |
| Backend Go | `lenses/backend-go.md` | `go/**` |
| Deploy safety | `lenses/deploy-safety.md` | Atlas migrations, `.proto`, or helm/deployment values |

## Contract

See `README.md` for the caller-filled slots, the shared report format, the severity scale, and dispatch notes.
