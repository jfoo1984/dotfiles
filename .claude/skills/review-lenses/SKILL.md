---
name: review-lenses
description: Shared library of stack-neutral code-review lens prompts read by review-code and implement-task-with-review; not invoked directly.
---

# review-lenses

This is a shared library — not a skill you invoke. Consumers (the `review-code` skill and `implement-task-with-review`) load individual lens files and dispatch them as subagents.

## Pure-reporter rule

**Lenses are pure reporters.** Every lens analyzes the target, emits findings, and returns a verdict — it never edits, stages, commits, or posts.

## Lenses

Every lens here is stack-neutral — no framework, path, or house convention is named — so they apply to any project. `frontend` and `backend` are layer-specific but language-agnostic, and defer to the project's own `CLAUDE.md`/`AGENTS.md` where it states a convention.

### Always run

| Lens | File | Concern |
|------|------|---------|
| Code quality | `lenses/code-quality.md` | Line-specific: naming, edge cases, error handling, types, dead code, comments |
| Staff engineer | `lenses/staff-engineer.md` | Architectural: right abstraction, coupling traps, future-reader surprise, sleep-losers |
| Test coverage | `lenses/test-coverage.md` | Is new/changed logic tested, and are the tests meaningful? Skip only on docs/config-only diffs |

### Auto-added by what the diff touches

| Lens | File | Concern | Trigger |
|------|------|---------|---------|
| Frontend | `lenses/frontend.md` | UI craft: composition, async states, a11y, render perf, state placement, effects, styling | Components, pages, routes, styles, client state |
| Backend | `lenses/backend.md` | Server craft: data access, transactions, idempotency, concurrency, timeouts, jobs, observability | Handlers, APIs, data access, jobs, service calls |
| Security | `lenses/security.md` | Attacker-reachable weakness: injection, authz gaps, secrets, crypto, untrusted parsing, SSRF, exhaustion | Auth, input handling, secrets, crypto, I/O, deps |
| Deploy safety | `lenses/deploy-safety.md` | Rollout safety: rolling-deploy compat, expand-contract migrations, wire compatibility | Schema migrations, wire contracts, deploy config |

### Opt-in

| Lens | File | Concern |
|------|------|---------|
| Adversarial | `lenses/adversarial.md` | Refute-posture correctness attack — tries to break invariants/guards/state-transitions |

`security` and `adversarial` overlap at the edges: `adversarial` asks "can this invariant be broken by any input or interleaving"; `security` asks "can an untrusted party reach and abuse this." Each file states the split.

## Adding project-specific lenses

Keep this library stack-neutral. A project with enough of its own conventions to warrant a standing lens should add a language- or framework-specific one (e.g. `backend-go.md`, `rails.md`) in that project's own `.claude/skills/`, citing its convention docs as authority — it narrows `backend`/`frontend` rather than replacing them. See `README.md` → Project specialization.

## Contract

See `README.md` for the caller-filled slots, the shared report format, the severity scale, and dispatch notes.
