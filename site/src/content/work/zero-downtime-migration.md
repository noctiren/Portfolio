---
title: Zero-downtime migration
company: envel · Backend
role: Software Engineer
period: Feb 2020 – Jun 2023
order: 4
summary: A zero-downtime migration restructuring every live user's envelope data for a new budgeting model, in isolated per-user batches behind a per-user switch, alongside the backend move between core banking providers.
tags: [Kotlin, Spring, GraphQL, Event-driven workers, Core banking, Feature flags]
---

## Context

At envel, I was the primary engineer on the core banking API: a Kotlin/Spring GraphQL monolith covering
accounts, envelopes, transactions, cards, transfers and onboarding.

## Problem

Two big moves, both touching live users' money:

- A **new budgeting model** meant restructuring every live user's envelope data.
- The company moved **between core banking providers**, from Q2 to Helix/CorePro.

## Approach

- **Batches, isolated per user:** users were migrated in batches, and one user's failure didn't stop the rest.
- **A per-user switch:** each user was flipped to the new model with a feature flag once their data had been
  migrated. No dual writes.
- **Idempotent re-runs:** running the migration again skipped users who were already migrated, so it was
  always safe to re-run.
- **Core banking move:** I led the backend migration, with a new client library, a shared processor framework,
  and the **event-driven workers** that moved deposits, withdrawals and statements onto the new core.

## Result

- Every live user's envelope data was restructured for the new model with **no lost funds** and no downtime.
- Deposits, withdrawals and statements moved onto the new core banking provider.
