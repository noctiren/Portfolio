---
title: Multi-cloud Terraform platform
company: ixo · Platform
role: DevOps Engineer
period: Feb 2024 – present
order: 1
summary: A config-driven Terraform platform across Vultr, AWS and GCP that any team can plug their own environments into, with onboarding docs to match.
tags: [Terraform, Kubernetes, EKS / GKE / VKE, AWS, GCP, Vultr, ArgoCD]
---

## Context

ixo runs its platform on Kubernetes across three clouds: AWS (EKS), GCP (GKE) and Vultr (VKE). Luke joined
as the sole platform hire, half-time from February 2024 alongside his job at BMTX and full-time since March 2025.

> **TODO(Luke):** What did the infrastructure look like before the platform? (For example: hand-written Terraform per environment, click-ops in the consoles, one cloud only?)

## Approach

- Built a **config-driven** Terraform platform: teams plug their own environments into it instead of writing
  their own infrastructure code.
- Spans **Vultr, AWS and GCP** from the same platform.
- Wrote the **onboarding docs** for teams plugging in.
- Ran **cost comparisons** of multi-cloud against an AWS-only setup.

> **TODO(Luke):** What does a team actually write to add an environment (a YAML file, a tfvars file, a module call)? A short, made-up-free example would make this page much stronger.

## Result

- Cost comparisons showed **28–36% savings** going multi-cloud vs. AWS-only.
- Also at ixo: backup storage costs cut by **60–80%** with GCS lifecycle policies.
- Any team can plug in its own environments, with docs to follow.

> **TODO(Luke):** How many teams and environments run on the platform today? And was the multi-cloud setup adopted because of the 28–36% comparison?
