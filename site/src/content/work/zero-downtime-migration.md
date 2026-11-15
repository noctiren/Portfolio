---
title: Zero-downtime migration
company: envel · Backend
role: Software Engineer
period: Feb 2020 – Jun 2023
order: 4
summary: A zero-downtime migration restructuring every live user's envelope data for a new budgeting model, alongside the backend move between core banking providers.
tags: [Kotlin, Spring, GraphQL, Event-driven workers, Core banking]
---

## Context

At envel, I was the primary engineer on the core banking API: a Kotlin/Spring GraphQL monolith covering accounts, envelopes, transactions, cards, transfers and
onboarding.

## Problem

Two big moves, both touching live users' money:

- A **new budgeting model** meant restructuring every live user's envelope data.
- The company moved **between core banking providers**, from Q2 to Helix/CorePro.

> **TODO(Luke):** Roughly how many users or envelopes did the migration cover?

## Approach

- **Envelope migration:** written to run with **zero downtime**, with **per-user failure isolation** (one
  user's failure doesn't stop the rest) and **safe re-runs**.
- **Core banking move:** I led the backend migration, with a new client library, a shared processor framework,
  and the **event-driven workers** that moved deposits, withdrawals and statements onto the new core.

> **TODO(Luke):** How did you keep the app live during the envelope migration (for example: dual writes, a feature flag, migrating users in batches)? One or two sentences in your own words would do.

## Result

- Every live user's envelope data was restructured for the new model with **no lost funds**.
- Deposits, withdrawals and statements moved onto the new core banking provider.

> **TODO(Luke):** How long did each migration take to run, and were there any re-runs in production?
