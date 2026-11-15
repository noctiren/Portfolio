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
full-time, overlapping my first year at ixo. The goal: turn KYC / identity verification (IDV) into a product
for the company's university partners.

## Approach

- **Two services, built from scratch:** a gRPC **public gateway** for partners and a **domain engine** behind
  it. I was the dominant contributor on both from day one.
- **Bulk verification:** a **Spring Batch** pipeline reads PGP-encrypted student cohort files from Azure Blob
  Storage, routes each one per school, generates results and quarantines failures.
- **Decisions over Socure:** reason codes are fetched and translated, and score-based filtering turns each
  check into **accept, review or reject**.

## Result

- Integrated end to end into Azure: App Configuration and Key Vault for config and secrets, Service Bus for
  messaging, Functions and AKS for hosting.
- Hardened for production with **Redis caching, rate limiting and health checks**.
