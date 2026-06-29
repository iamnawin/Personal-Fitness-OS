# Naveen Global AI Agent Operating Instructions

This file provides Claude Code and other AI coding agents with global context about Naveen's projects and preferences across all sessions.

---

## About the User

**Naveen** — founder / AI engineer at **ZeroOrigins AI**. Runs multiple concurrent projects ranging from enterprise prototypes to production AI applications. Prefers terse, direct responses. Strong product instinct, delegates technical implementation to Claude.

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

* State your assumptions explicitly. If uncertain, ask.
* If multiple interpretations exist, present them - don't pick silently.
* If a simpler approach exists, say so. Push back when warranted.
* If something is unclear, stop. Name what's confusing. Ask.

---

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

* No features beyond what was asked.
* No abstractions for single-use code.
* No "flexibility" or "configurability" that wasn't requested.
* No error handling for impossible scenarios.
* If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

---

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

* Don't "improve" adjacent code, comments, or formatting.
* Don't refactor things that aren't broken.
* Match existing style, even if you'd do it differently.
* If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

* Remove imports/variables/functions that YOUR changes made unused.
* Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

---

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

* "Add validation" → "Write tests for invalid inputs, then make them pass"
* "Fix the bug" → "Write a test that reproduces it, then make it pass"
* "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```txt
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Rules Files Location

Global rules:

```txt
C:\Users\Naveen\.claude\rules\
```

* `agents.md` — when and how to use agents
* `development-workflow.md` — plan → TDD → review → commit
* `git-workflow.md` — commit format, PR process
* `performance.md` — model selection, context management
* `coding-style.md` — TypeScript patterns

Primary global instruction files may also exist at:

```txt
C:\Users\Naveen\.claude\CLAUDE.md
C:\Users\Naveen\.gemini\GEMINI.md
C:\Users\Naveen\.codex\AGENTS.md
/home/naveen/.claude/CLAUDE.md
```

Do not edit plugin cache, marketplace, node_modules, or generated skill copies.

---

# Developer Package Management & Tooling Rules

You must strictly adhere to the following package manager and installation rules for all code generation, terminal commands, and documentation.

## Node.js / JavaScript Ecosystem

* ALWAYS use `pnpm` for installing packages, initializing projects, and running scripts.
* NEVER suggest or use `npm` or `yarn` unless explicitly requested by the user.
* Example: use `pnpm add <package>` or `pnpm dlx <command>`.

Allowed exception:

* If a tool's official installation only supports `npm` and no `pnpm` equivalent exists, explain why before using it.

## Python / CLI Tooling Ecosystem

* ALWAYS use `uv` and `uvx` for Python package management, virtual environments, and global tool installations.
* NEVER suggest or use `pip`, `pipx`, or standard `venv` modules unless explicitly requested.
* For permanent CLI installations, use: `uv tool install <tool>`
* For temporary, zero-install executions, use: `uvx <tool>@latest`

---

## Command Safety Rules

Allowed safe commands:

* `dir`
* `type`
* `findstr`
* `ls`
* `cat`
* `grep`
* `git status`
* `git diff`
* `pnpm test`
* `pnpm run lint`
* `pnpm run build`

Blocked dangerous commands unless explicitly confirmed:

* `rm -rf`
* `del /s /q`
* `git push --force`
* `git reset --hard`
* `DROP TABLE`
* destructive database migrations
* deleting cloud resources
* deleting Gmail / Drive / Workspace data

Before destructive operations, explain the impact and ask for confirmation.

---

# Naveen AI Workspace Rules

## Code Workspace

Primary code workspace:

```txt
D:\AI-Workspace\Repos
```

Legacy / older workspace path may exist:

```txt
D:\AI-Workspace\Projects
```

Prefer `D:\AI-Workspace\Repos` unless the user explicitly says the project is in `Projects`.

Before editing any repo:

1. Run `git status`
2. Confirm the current branch
3. Read README, package files, and project-specific `CLAUDE.md`, `AGENTS.md`, or `GEMINI.md` if available
4. Do not overwrite uncommitted work
5. Do not commit secrets, `.env` files, `node_modules`, build outputs, generated graph output, or database files

Do not create, clone, initialize, install, or build anything in:

```txt
C:\Users\Naveen
```

Before any `git clone` or project creation command, run:

```bat
cd /d D:\AI-Workspace\Repos
```

---

## WSL Workspace Mapping

Windows path:

```txt
D:\AI-Workspace\Repos
```

WSL path:

```bash
/mnt/d/AI-Workspace/Repos
```

When using WSL, prefer:

```bash
/mnt/d/AI-Workspace/Repos
```

Do not confuse Windows global Claude files with WSL Claude files.

Windows Claude:

```txt
C:\Users\Naveen\.claude\CLAUDE.md
```

WSL Claude:

```bash
/home/naveen/.claude/CLAUDE.md
```

---

## Memory Workspace

Primary Obsidian memory vault:

```txt
C:\Users\Naveen\OneDrive\ドキュメント\Naveen AI Vault\All Ai Apps
```

Before serious project work, read:

* `Projects/Project Index.md`
* `Memory/Preferences.md`
* `Memory/Decisions.md`
* `Memory/Mistakes-To-Avoid.md`
* related project notes

---

## Obsidian Vault Rule

Obsidian is for memory, planning, decisions, product notes, prompts, architecture notes, and meeting notes.

Do not treat the Obsidian vault as the source code workspace.

NotebookLM summaries may be used as project context, but code and repo files remain the source of truth.

---

## Product Direction

Treat all projects as real products, not throwaway demos.

Default product mindset:

* Understand the product purpose before coding.
* Identify the target user, workflow, and business outcome.
* Preserve existing product direction unless the user explicitly changes it.
* Do not turn a focused product into a generic platform.
* Do not add features only because they are technically possible.
* Keep the product simple, usable, and execution-ready.
* Prefer practical workflows over theoretical architecture.
* Avoid generic SaaS language, generic AI-agent language, and vague marketing copy.
* Respect each repository’s own `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `PROJECT_MEMORY.md`, and `README.md` for project-specific direction.

Project-specific product rules must live inside the project repo, not only in this global file.

Examples:

* ZeroOrigins-specific rules belong in `zeroorigins-os/AGENTS.md`
* PlotDNA-specific rules belong in `PLOTDNA-AI/AGENTS.md`
* OrgTrace-specific rules belong in `OrgTrace/AGENTS.md`
* Retail Execution / PSS-specific rules belong in that project’s repo instruction file

Global rule:
When entering any repo, first read the project-level instruction files and follow that product’s own direction.
---

## Context Token Management Rules

```yaml
context_token_management:
  enabled: true

  thresholds:
    soft_compact_at: "70%"
    hard_compact_at: "90%"

  soft_compaction_rule:
    when: "context usage reaches around 70%"
    actions:
      - "Pause and create a compact working summary."
      - "Preserve goal, current phase, completed work, pending work, files changed, decisions, blockers, and next step."
      - "Drop repeated explanations, old failed attempts, duplicate logs, outdated plans, and irrelevant exploration."
      - "Continue using the compact summary as the source of truth."

  hard_compaction_rule:
    when: "context usage reaches around 90%"
    actions:
      - "Stop immediately, even if in the middle of implementation."
      - "Create a handoff summary before continuing."
      - "Include current state, files changed, commands run, errors seen, next action, and things not to break."
      - "Compact the working context."
      - "Resume from the paused step after compaction."

  long_running_task_state:
    maintain:
      - current_objective
      - current_phase
      - files_being_edited
      - locked_decisions
      - commands_run
      - errors_seen
      - next_action
      - risks_and_things_not_to_break

  safe_to_clear:
    - old_failed_attempts
    - duplicate_logs
    - repeated_prompts
    - outdated_plans
    - screenshots_already_converted_into_requirements
    - completed_checklist_items
    - irrelevant_exploration_notes
    - verbose_reasoning_after_summary_is_created

  must_preserve:
    user_context:
      name: "Naveen"
      profile:
        - "Founder / AI engineer at ZeroOrigins AI"
        - "Business analyst"
        - "Salesforce architect/developer"
        - "AI/product builder"
      preferences:
        - "Terse, direct, implementation-ready outputs"
        - "Copy-ready prompts, docs, checklists, and structured plans"
        - "Compact but complete responses"
        - "Do not over-explain unless needed"
      common_work_areas:
        - Salesforce
        - ZeroOrigins
        - AI agents
        - cinematic video prompts
        - product planning
        - architecture planning

  emergency_rule: >
    If context usage reaches 90%, immediately compact and create a handoff
    summary before continuing. Do not continue blindly until context is exhausted.
```

---

# Naveen Global AI Agent Operating Rules

## Core Rule

You are working in Naveen’s AI development environment.

Do not behave like a blind code generator. Behave like a project-aware builder who protects architecture, memory, context, and momentum.

Your goal is to make the smallest correct improvement while preserving the existing system.

Before coding, understand the project.

Do not guess file locations, architecture, auth flow, database shape, or business logic.

Do not create new patterns when existing patterns already exist.

Do not add dependencies, abstractions, frameworks, services, or new folders unless clearly necessary.

Prefer:

* reuse over reinvention
* small targeted changes over rewrites
* existing project patterns over new architecture
* deleting/simplifying over adding
* clear validation over confident guessing

---

## Standard Startup Workflow

When starting work in any repository:

1. Identify the repository name and purpose.
2. Run `git status`.
3. Confirm the current branch.
4. Check for project memory and instruction files:

   * `AGENTS.md`
   * `CLAUDE.md`
   * `GEMINI.md`
   * `PROJECT_MEMORY.md`
   * `README.md`
   * `graphify-out/GRAPH_REPORT.md`
   * `/docs`
   * Obsidian/exported notes
   * NotebookLM summaries
5. Read the most relevant context before editing.
6. Identify the relevant module.
7. Identify risky files.
8. List files likely to change.
9. Make a focused plan.
10. Make the smallest safe change.
11. Run validation where possible.
12. Explain what changed and how to test it.

If project memory and code disagree, trust the code, but call out the mismatch.

---

## Project Memory Priority

Use memory/context sources in this order:

1. `PROJECT_MEMORY.md`
2. `graphify-out/GRAPH_REPORT.md`
3. `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
4. `README.md`
5. `/docs`
6. Obsidian notes or exported markdown
7. NotebookLM summaries
8. Direct code inspection

Never ignore project memory if it exists.

---

## Graphify

Graphify is the project map and repo memory tool.

Use Graphify when:

* starting work on a large or unfamiliar repo
* architecture is unclear
* making a refactor
* touching auth, routing, database, shared components, or AI/backend logic
* doing a large UI redesign
* the user asks for project understanding

Expected files:

```txt
graphify-out/GRAPH_REPORT.md
graphify-out/graph.html
graphify-out/graph.json
```

Before significant work, read:

```txt
graphify-out/GRAPH_REPORT.md
```

If missing and the task is large, suggest running:

```bash
graphify .
```

Do not commit `graphify-out/` unless the project explicitly wants generated graph output stored.

---

## Ponytail Mode

Use Ponytail thinking by default for coding tasks.

Before adding code, ask:

1. Does this already exist?
2. Can an existing helper, component, action, schema, or utility solve this?
3. Can this be done with fewer files?
4. Is a new dependency avoidable?
5. Are we creating a second pattern?
6. Can we delete or simplify instead of adding?

Use:

* `ponytail` for general restraint
* `ponytail-audit` for complexity review
* `ponytail-review` before accepting large changes
* `ponytail-debt` for cleanup analysis
* `ponytail-gain` to identify simplification opportunities

The best code is often the code not written.

---

## RTK

RTK is used to reduce terminal-output noise and token waste.

When running noisy commands, prefer RTK if available:

```bash
rtk pnpm run build
rtk pnpm run lint
rtk pnpm test
rtk pnpm check
rtk git diff
rtk git status
```

If RTK is unavailable, run commands normally but keep logs focused.

Do not paste huge logs into responses. Summarize only the relevant errors, warnings, and fixes.

If a project is clearly npm-only, the agent may use npm only after stating why.

---

## Frontend / UI Work

For frontend design, UI polish, layout, typography, spacing, or visual hierarchy, use:

* `design-taste-frontend`
* `impeccable`

Use them when:

* redesigning a screen
* improving dashboard quality
* fixing generic AI/SaaS-looking UI
* improving spacing, hierarchy, typography, interaction, or responsive behavior

For UI work:

1. Audit first.
2. Define the visual direction.
3. List the files to touch.
4. Preserve behavior and data flow.
5. Make UI-only changes unless explicitly asked otherwise.

Do not change auth, database, server actions, routing, or backend logic for a pure UI task.

---

## claude-watch

Use `claude-watch` only for video analysis.

Use it for:

* YouTube analysis
* local video review
* UI recording analysis
* hook/pacing breakdown
* storyboard review
* tutorial summarization
* creative video critique

Example:

```txt
/watch video.mp4 --start 0 --end 15 analyze the visual hook and pacing
```

Do not use video tools for codebase analysis.

---

## Google Workspace CLI

`gws` is the Google Workspace action bridge.

It may access:

* Gmail
* Drive
* Calendar
* Sheets
* Docs
* Slides
* Tasks
* People
* Chat
* Forms
* Meet
* Apps Script

Use `gws` only when explicitly asked.

Default safe mode:

* list
* search
* read
* summarize
* create drafts
* create test docs/sheets only when safe

Require explicit permission before:

* sending emails
* deleting files
* modifying business data
* bulk-updating Sheets
* creating or changing Calendar invites
* accessing admin/reporting scopes

Prefer drafts over sending emails.

---

## Convex

For new AI-first apps or MVPs, Convex may be used as a backend if the project chooses it.

Use Convex patterns:

* `convex/schema.ts` for schema
* queries for reads
* mutations for writes
* actions for external APIs, AI calls, scheduled/background work, or nondeterministic operations
* validators for all function arguments
* generated API imports from `convex/_generated/api`

Never manually edit:

```txt
convex/_generated/
```

Do not replace Supabase/Postgres in existing apps unless explicitly requested.

---

## Supabase / Existing App Rule

For existing Supabase/Postgres projects, preserve existing backend architecture.

Be careful with:

* auth
* RLS policies
* migrations
* server actions
* API routes
* shared clients
* environment variables
* generated types
* seed/test data

If a task touches roles, auth, routing, or database access, identify both:

```txt
App access layer
Database access / RLS layer
```

Changing one does not automatically update the other.

---

## Risky Files

Never casually modify:

* auth files
* middleware/proxy files
* RLS policies
* database migrations
* shared types
* shared UI primitives
* server action infrastructure
* AI provider/client logic
* environment configuration
* package manager files
* lockfiles

If editing a risky file is necessary, explain why before changing it.

---

## Before Coding Response Format

Before making changes, respond with:

```txt
Understanding:
- ...

Relevant module:
- ...

Files to inspect:
- ...

Files likely to change:
- ...

Risky files:
- ...

Plan:
1. ...
2. ...
3. ...

Validation:
- ...
```

---

## After Coding Response Format

After making changes, respond with:

```txt
Files changed:
- ...

What changed:
- ...

What was reused:
- ...

What was intentionally not built:
- ...

Data/control flow:
- ...

Validation:
- ...

How to test:
- ...
```

---

## Final Rule

Protect the architecture.

Make the system sharper, not bigger.
