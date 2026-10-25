![Soxoa Ops](.claude-plugin/icon.png)

# Soxoa Ops

Fifteen skills for owners and operations leaders who run real work through Claude. They come from the routines Soxoa uses to run its own products: capture what customers say, see who signs up and where they get stuck, close every agent session with a clear owner to-do list, check marketing claims against evidence, and scope automation before anyone builds it.

This plugin is instructions only. It has no MCP server, hooks, scripts or network calls of its own, and it sends data nowhere. Each skill works with the files, connectors and tools your Claude session already has, and says what it needs when something is missing.

## Skills

### Run the business

| Skill | What it does |
|---|---|
| `feedback-inbox` | Every customer quote kept verbatim, grouped into issues, ranked by how many people asked. |
| `signup-pulse` | An email the moment someone signs up, a morning list of who got stuck, and a walk through the real funnel. |
| `chief-of-staff-brief` | A daily brief built from commits and the requests typed into AI sessions: what moved, what's stuck, what was promised. |
| `owner-actions` | Ends every agent session with a dated, copy-paste list of what only the owner can do, with proof for what's done. |

### Marketing and sales

| Skill | What it does |
|---|---|
| `claim-audit` | Grades copy against the 22 Laws and checks every number, logo and “compliant” against real evidence. |
| `screenshot-moment` | Find the one screen a customer would share, then clear the gates, crops and bland previews hiding it. |
| `ad-path-check` | Ten distinct ad concepts, exact targeting, and a click-through of every path to the payment step before launch. |
| `research-prospect-brief` | Turn public business evidence into cited account hypotheses, contrary explanations, rejection rules, and unsent outreach drafts. |
| `build-marketing-kit` | Create coordinated one-pagers, press facts, and content calendars from dated product truth, approved evidence, and brand assets. |
| `audit-site-discoverability` | Compare a site's page inventory with its actual navigation paths and prepare relevant repairs for disconnected content. |

### Writing

| Skill | What it does |
|---|---|
| `build-voice-guide` | Turn authorized writing samples into channel-specific voice rules and a shareable drafting prompt. |
| `write-evidence-article` | Produce a useful sourced article through distinct drafting, factual editing and style-review passes. |
| `build-editorial-pitch-pack` | Find a public-interest angle in documented work and create outlet-specific articles, pitches and submission notes. |

### AI adoption

| Skill | What it does |
|---|---|
| `scope-automation-opportunity` | Turn one recurring workflow into an automate, assist, discovery, or stop recommendation with review, acceptance, and illustrative economics. |
| `evaluate-ai-output` | Review AI output against original source evidence with explicit omissions, false positives, source conflicts, and acceptance boundaries. |

## Setup

- **Claude Code marketplace:** run `/plugin marketplace add johnarndt/soxoa-claude-plugins`, then `/plugin install soxoa-ops@soxoa-plugins`.
- **One skill:** copy its folder from `skills/` into `~/.claude/skills/` or a repository's `.claude/skills/`.
- **Claude apps:** zip a skill's folder (or download it from [johnarndt.net/skills](https://johnarndt.net/skills)) and upload it under Customize → Skills.

## Example prompts

- "Log this customer email for Acme and tell me the top three issues."
- "Email me whenever someone signs up, and send a morning list of who got stuck."
- "What's left for me to do from this session?"
- "Audit our homepage for positioning and any claims we can't back up."
- "Scope our invoice intake: automate, assist, investigate or stop?"

## Limits and boundaries

- Every skill stops at a list, report or draft. Sending, posting, publishing, paying, deploying and approving stay with you.
- Skills never invent statistics, testimonials or customer results, and they label estimates and illustrative examples as such.
- Results are planning and review aids, not legal, financial or other professional advice.
- Version 0.1.0. These are drafts: the workflows have been run on Soxoa's own products, but the packaged skills are new. Try each on a small task you can check first, and report problems at [soxoa.com/support](https://soxoa.com/support).

## Related

The [`soxoa`](../soxoa/) plugin connects Claude to Soxoa's automation-planning tools (ROI estimates and workflow ranking). `scope-automation-opportunity` can use those tools when they are connected.
