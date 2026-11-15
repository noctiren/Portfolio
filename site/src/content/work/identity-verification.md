---
title: Identity verification platform
company: BMTX · Backend
role: Software Engineer
period: Jun 2023 – Mar 2025
order: 3
summary: A partner-facing KYC/IDV platform built from scratch, as a gRPC public gateway plus domain engine, a Spring Batch pipeline for PGP-encrypted cohort files, and a decision layer over Socure.
tags: [Spring Batch, gRPC, Socure, Azure AKS, Service Bus, Key Vault, Azure Functions, Redis]
---

## Context

BM Technologies (BMTX, formerly BankMobile) is based in Pennsylvania, US. I worked there remotely and
full-time, overlapping my first year at ixo. The goal: productise KYC / identity verification (IDV) for the
company's university partners.

> **TODO(Luke):** Roughly how many university partners or students did the platform serve? And how big was the team around you?

## Approach

- **Designed and built it from scratch** as a gRPC service pair: a **public gateway** for partners and a
  **domain engine** behind it. I was the dominant contributor on both from day one.
- **Bulk verification pipeline** with **Spring Batch**: processes PGP-encrypted student cohort files from
  Azure Blob Storage, with per-school routing, result generation and failure quarantine.
- **Decision layer over Socure:** reason-code retrieval and translation, and score-based filtering that
  produces **accept / review / reject** outcomes.
- **Azure end to end:** App Configuration, Key Vault, Service Bus, Functions and AKS.

## Result

- Hardened for production with **Redis caching, rate limiting and health checks**.
- Integrated end to end into Azure, from configuration and secrets (App Configuration, Key Vault) to messaging (Service Bus) and hosting (Functions, AKS).
- Every cohort file is routed per school, with results generated and failures quarantined.

> **TODO(Luke):** Any numbers to add? For example: cohort file sizes, verifications per run, or how long a bulk run takes.
