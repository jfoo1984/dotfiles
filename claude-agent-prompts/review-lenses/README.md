# review-lenses — Lens Contract

This document defines the contract all lenses in this library must follow. Every consumer (skill or bot) and every lens file must adhere to it.

---

## Pure-reporter rule

**Lenses are pure reporters.** A lens analyzes the target and reports findings plus a verdict. It never edits, stages, commits, posts comments, or performs any other side-effecting action. This rule is non-negotiable and every lens file must state it explicitly.

---

## Scope: review the change, but read beyond it

The target is the change, not the whole codebase — but a lens that stays strictly inside the diff misses two things, so each lens must (and the reviewer subagents have Read/Grep/Glob to do so):

1. **Pattern consistency** — compare the change against existing patterns in neighboring code and flag divergence from how the codebase already does this. A diff can be internally fine yet inconsistent with established conventions.
2. **Impact / blast radius** — trace the callers, implementers, and dependents the change touches and check they still hold. A proto/interface/contract change frequently breaks code that isn't in the diff.

The guardrail: explore only what's needed to judge the change. This is targeted reading around the diff, **not** a whole-codebase review. Every lens file states this in its own `## Scope` section.

---

## Caller-filled slots

Consumers fill these slots when constructing the prompt for each lens subagent.

| Slot | Required | Content |
|------|----------|---------|
| `[TARGET]` | Yes | The code under review. Include: (a) explicit file paths with absolute paths, (b) the diff text (e.g. `git diff`, branch diff, or PR diff), or (c) a PR URL. Whatever form, the lens must be able to read the actual code. |
| `[WHAT WAS IMPLEMENTED]` | Optional | 3–5 lines describing the change. Omit when reviewing arbitrary code with no implementation context. |
| `[ALREADY VERIFIED]` | Optional | Prior lens verdicts and/or build/test status. Prevents re-litigating what earlier lenses already covered. |

The `[TARGET]` slot is the only required slot. Lenses must function without the optional slots.

---

## Shared report format

All lenses emit findings in this exact format. Section names and severity words are fixed — do not paraphrase them.

```
### Findings

- [severity] file:line — issue description + concrete fix suggestion. Confidence: NN (include when below 100%).

### What looks good

(Optional — include only genuinely above-the-bar items, not everything that passes.)

### Verdict

<one-line verdict + brief rationale>
```

The verdict line uses emoji signals from this set: `✅ Ready as-is`, `⚠️ Ready with small fixes`, `❌ Needs work`. The staff-engineer lens uses "Land"-worded equivalents and adds a fourth: `✅ Land as-is` (≡ Ready as-is), `✅ Land with documented follow-ups`, `⚠️ Land with small fixes` (≡ Ready with small fixes), `❌ Hold for refactor` (≡ Needs work). A consumer consolidating verdicts across lenses should treat the Land/Ready pairs as equivalent.

---

## Severity scale

| Severity | Meaning |
|----------|---------|
| **blocking** | Bug, broken contract, type error, or missing guard with a concrete failure mode. Merging degrades the codebase. |
| **important** | Clarity issue, name confusion, unexpected coupling, or missing-WHY comment. Worth fixing before merge, not catastrophic if missed. |
| **minor** | Style preference or marginal improvement. Omit from output unless findings are very few. |

---

## Dispatch note

Consumers dispatch each lens as a subagent:

```yaml
subagent_type: feature-dev:code-reviewer
```

The model default is stated in each lens file. Consumers may override it, but should prefer the lens-file default: `sonnet` for code-quality (rarely needs more), `opus` for staff-engineer (architectural judgment benefits from the stronger model).

**Model defaults are tier aliases, not pinned versions.** `sonnet` / `opus` resolve to the current latest model in that tier, so they track model upgrades automatically — do not pin a dated id like `claude-opus-4-8`. Naming a tier (rather than omitting `model` to inherit the session model) keeps each role at its intended capability level across releases: a session running on sonnet would otherwise silently downgrade the staff-engineer/adversarial review. Revisit these defaults only if a tier is added or renamed.

## How lens files render the slots

In each lens file the caller-filled slots appear as a section heading followed by an italic _Caller fills:_ instruction (e.g. `## Target` then `_Caller fills: …_`). The consumer writes the actual content under the heading when constructing the dispatch prompt — there is no literal `[TOKEN]` to string-replace.

---

## Keeping lenses current

Lenses are living — the stack lenses (`frontend`, `backend-go`) encode conventions from `CLAUDE.md` / `conventions.md` that drift. Improve a lens on **evidence from a review** — a real miss, a repeated false positive, or a drifted convention — not on speculation, and route changes through `reflect-and-update`. **Keep every edit as terse as the lens itself**: each line is re-sent to the reviewer on every dispatch, so add only necessary info and prefer compressing or replacing over appending — a lens that only grows loses focus.

Detection is the **consumer's** job, not the lens's: a single-diff lens subagent can't tell a one-off from a recurring gap, so `review-code` / `implement-task-with-review` / the PR bot surface a one-line **lens-gap note** when they spot one. Lenses stay pure reporters — they never edit themselves.
