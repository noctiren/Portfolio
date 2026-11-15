---
title: Guardrails for AI agents
company: opcode · AI platform
role: Extended / rewrote large parts
period: Side project
order: 5
summary: Platform engineering for AI agents. I took opcode, an open-source desktop app for Claude Code, and rewrote large parts of it into a manager/worker system with model caps, budgets, file locks, an owner inbox and rule files.
tags: [Claude Code, AI agents, Multi-agent, Guardrails, Cost limits, Governance]
diagram: opcode
---

## Context

[opcode](https://github.com/winfunc/opcode) (formerly Claudia) is an open-source desktop app and toolkit for
Claude Code, licensed under AGPL-3.0. I didn't build it from scratch: I **extended it and rewrote large parts
of it** for the way I work with coding agents every day.

The problem I was solving is a platform problem, not an AI one. Once several agents work on the same project,
you need the same things you need for any shared platform: **guardrails, cost limits and governance**.

## What I added

- **Managers and workers.** A manager chat plans the work and starts a worker chat for each task. Workers
  ask their manager for routine go-aheads, so only what really needs me reaches me.
- **Caps, budgets and accounts.** Each profile has a ceiling for model and effort, so a simple task can't
  run on the most expensive settings. Budget stop lines halt work before a usage limit is hit, and work can
  switch between accounts.
- **Locks and an owner inbox.** Agents claim files before they edit them, so two agents never change the same
  file at once. Decisions only I may make go to an inbox as cards instead of being guessed, and risky commands
  trip a **LUKE-ONLY** stop that waits for my approval.
- **Rules and trackers.** Rule files (`MANAGER.md`) say what agents may decide on their own. Profiles set the
  area and limits for each kind of worker, tracker files keep the state of the work, and an **AFK mode** lets
  work continue while I'm away.

## Why it matters

It's the same thinking I use on infrastructure: least privilege, budgets and alerts, locks against
concurrent changes, and a clear line between what automation may do and what needs a human.

## Status

My version **isn't public yet**. I plan to publish it, in line with the original project's licence. The
upstream project is at [github.com/winfunc/opcode](https://github.com/winfunc/opcode).

<!-- SCREENSHOT SLOT (Q12d): add 1-2 screenshots here once Luke picks them. Nothing private may be visible:
     no emails, account names, local paths or card contents. Blur or crop before adding. -->
