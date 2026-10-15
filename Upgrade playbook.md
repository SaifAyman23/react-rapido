# Upgrade Playbook — Rebrand + Guides (Abstract, Reusable)

> Apply this playbook to **any template** that was extracted from a live project and needs to become a **standalone, branded product**. Replace `{{OLD_BRAND}}` / `{{NEW_BRAND}}` / `{{PROJECT_DIR}}`. Nothing is removed from the codebase — only rebranded, clarified, and extended. No specific tool is required to follow this.

## Table of Contents

1. [Goal](#goal)
2. [Phase 1 — Brand Scrub](#phase-1--brand-scrub)
3. [Phase 2 — Guide Navigation + Usability](#phase-2--guide-navigation--usability)
4. [Phase 3 — Deep Guides for Critical Features](#phase-3--deep-guides-for-critical-features)
5. [Phase 4 — Future Capabilities Roadmap](#phase-4--future-capabilities-roadmap)
6. [Phase 5 — Quality & Verification Fixes](#phase-5--quality--verification-fixes)
7. [Phase 6 — Final Verification & Publish](#phase-6--final-verification--publish)
8. [Checklist](#checklist)

---

## Goal

Turn a template that still carries the identity of the original product (`{{OLD_BRAND}}`) into a clean, standalone template (`{{NEW_BRAND}}`) where:

- No file mentions the old product — branding is native everywhere
- No guide contains awkward self-reference like `from {{NEW_BRAND}}` — every header reads as if the code was built for this template
- Every guide has easy navigation and explains **how to use** the code, not just **what it offers**
- 2–3 advanced features have deep guides that let someone **rebuild them from zero** and also **modify the existing implementation** — kept clearly separated
- One new roadmap file lists **optional future capabilities** grouped by value, without locking into any vendor
- Quality checks pass before publish

---

## Phase 1 — Brand Scrub

### What to do

1. **Find the old identity** — search the whole project (code + guides + config + docs) for the old name in any form (different capitalizations, hyphenated, spaced).
2. **First pass — direct rename** to the new name across all file types. Update visible branding places too: site title/header, readme hero line, config placeholders.
3. **Second pass — fix awkward leftovers.** A direct rename often creates sentences that now reference the new project as if it were an external source (e.g., `from {{NEW_BRAND}}/original-path`). Rewrite those to **native language**: describe the module as part of the current template, reusable and project-agnostic, without pointing to itself as an import.

### How to verify

- No file still contains the old name in any form
- No file contains self-referencing phrasing like `from {{NEW_BRAND}}`

### Result

Every comment, header, and guide reads as if the code was written for the new template from day one.

---

## Phase 2 — Guide Navigation + Usability

### The problem

Guides often describe `what the code offers` but don't show `how to use it`. They also lack navigation.

### What to do

1. **Add an index at the start of every guide** — a table of contents with links to each section, placed right after the title. If some guides already have it, add it to the ones missing so all are consistent.

2. **Add a `How to Use` section with copy-paste examples** to every guide that only describes features. Place it just before the removal/cleanup section. Each example should show:
   - Minimal import
   - One typical call with realistic arguments
   - Where the result appears / how to verify

3. **Keep existing good guides as-is.** If a guide already explains usage with examples, leave its structure.

### Result

- Every guide can be navigated quickly via its index
- Every guide answers both `what is this?` and `how do I use it in one copy-paste?`

---

## Phase 3 — Deep Guides for Critical Features

Pick the 2–3 features that make your template more than a basic starter (the ones a user wouldn't expect from a minimal setup). For each, create a **single deep guide** that serves **two separate jobs** without mixing them:

| Job                                 | What the reader needs                            | Section to read                                               |
| ----------------------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| **A. Understand the existing code** | How it works and if it already solves their need | `File Map` + `Architecture` + `What It Offers / When to Skip` |
| **B. Build it from zero**           | Step-by-step setup as if it didn't exist         | `Setup From Scratch`                                          |
| **C. Change it**                    | How to tune, extend, or replace it               | `How to Adjust / Enhance`                                     |

### Required sections for each deep guide

1. **What It Offers / When to Skip** — table of capabilities vs. table of cases where a simpler alternative is enough + a one-line rule of thumb.
2. **File Map** — every relevant file grouped by role, with location references. A newcomer should find any piece without searching.
3. **Architecture & How It Works** — end-to-end diagram + step-by-step flow of the main path and edge cases. Keep it visual and linear.
4. **Setup From Scratch** — ordered steps from empty to current state. Each step has a file to create or edit, a copy-paste block, and why that step exists. Ends with a verification step.
5. **How to Adjust / Enhance** — table of common tweaks (change a limit, add a field, change behavior, persist differently). Each row names the file to edit and shows the minimal change.
6. **Tradeoffs** — key decisions and what each costs/benefits, so the reader can decide to keep, change, or remove the feature.
7. **Verification** — 3–5 checks that prove the feature works after setup or after a change.
8. **Removal** — how to delete the feature cleanly (full vs. partial) without breaking the rest.

Keep **A** and **B** in separate sections — a reader who only wants to understand should not have to read setup steps, and a reader who wants to rebuild should not have to reverse-engineer understanding.

---

## Phase 4 — Future Capabilities Roadmap

Add **one new file** that lists **optional capabilities** that could make any project using the template stronger. Don't lock into a vendor — describe each capability by **what value it adds and when to add it**.

Structure each entry the same way:

- **What value it adds** — one line
- **When to add it** — signal that indicates you need it
- **How it would wire in** — which layers it touches (config, routes, storage, background work, UI) in abstract terms
- **What it costs** — complexity or operational cost if you add it too early

Group entries by theme, for example: observability, realtime communication, alternative API styles, external event delivery (in and out), payment handling, search, file storage & delivery, transactional messaging, feature control, account security. Keep the list as **categories**, not tool names — the same playbook applies whether the template is a web app, mobile app, or API.

End the file with a simple priority order (what to add first when the project grows) and a wiring map that says which layer each capability touches.

---

## Phase 5 — Quality & Verification Fixes

Rebranding and guide rewrites can surface hidden gaps that were green before.

- **Formatting & style checks** — run the project's formatter and import/lint checks in check-mode. Docs-only changes should still pass.
- **Type/static checks** — run the project's static analysis if it has one.
- **Tests** — run the test suite in isolated mode (in-memory or test database) and ensure all tests pass. If a feature had missing setup (e.g., empty migration folder, missing table), generate it so tests can create their data.
- **Configuration & build checks** — validate that the project's configuration files are still valid and that the build still produces the expected artifacts.
- **No embedded secrets** — verify that configuration still reads from environment, with no hardcoded keys left in code after the rebrand.

Common fixes that appear at this stage: a component referenced in configuration but not defined, a permission rule that blocks a public endpoint, or a data model with no initial setup file.

---

## Phase 6 — Final Verification & Publish

1. Add and review all changed files — expect a large diff if deep guides were rewritten.
2. Commit with a single message that names the rebrand, the deep guides touched, and any fixes applied.
3. Push to the main branch and confirm the automated pipeline reports all jobs green (quality, tests, build validation, security checks).

---

## Checklist

- [ ] No file mentions the old brand; no awkward self-reference remains
- [ ] Every guide has an index at the start; every guide that only described features now has copy-paste `How to Use`
- [ ] 2–3 critical features have deep guides with clearly separated sections: `File Map + Architecture + What/When Skip` (understand) vs `Setup From Scratch` (build) vs `How to Adjust` (modify)
- [ ] One new roadmap file exists listing future capability categories (what/when/how it wires/cost) without naming specific vendors
- [ ] Formatting, linting, static checks, tests, and build validation all pass; no hardcoded secrets
- [ ] Changes are committed and published; pipeline is green
