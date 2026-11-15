---
title: Multi-cloud Terraform platform
company: ixo · Platform
role: DevOps Engineer
period: Feb 2024 – present
order: 1
summary: An open-source, config-driven Terraform platform across Vultr, AWS and GCP. A team adds one .tfvars file and gets its own environment, so anyone with code-level skills can bring up their own ixo-like stack.
tags: [Terraform, Kubernetes, EKS / GKE / VKE, AWS, GCP, Vultr, ArgoCD, Open source]
---

## Context

ixo runs its platform on Kubernetes across three clouds: AWS (EKS), GCP (GKE) and Vultr (VKE). I joined
as the sole platform hire, half-time from February 2024 alongside my job at BMTX and full-time since March 2025.

Before the platform, the infrastructure was **mostly click-ops**: resources were created by hand in the cloud
consoles, with little or no infrastructure as code.

## Why

ixo wanted people with code-level skills to be able to pick up our Terraform and **bring up their own
ixo-like infrastructure** on their own cloud. We run services like Matrix alongside services that work with
ours, so the whole stack has to be reproducible, not just one cluster.

## Approach

- Built a **config-driven** Terraform platform: a team adds **a `.tfvars` file** with its values for the
  shared platform modules, instead of writing its own infrastructure code.
- Environments live in an `environments` map, with `application_configs` switching services on or off.
  Secrets come in through `TF_VAR_*` environment variables, and each environment gets its own Terraform
  workspace.
- Clusters run on **Vultr (VKE)** and **AWS (EKS)**, with **GCP** optional for Vault auto-unseal and backups.
  DNS goes through **Cloudflare** (external-dns), with **Tailscale** for VPN access and **GitHub OAuth** for login.
- Wrote the **onboarding docs** for teams plugging in, including a quickstart and a cost-estimate script.

An illustrative sketch of the shape (not a real config):

```hcl
# illustrative only
environments = {
  staging = {
    application_configs = {
      matrix     = { enabled = true }
      monitoring = { enabled = true }
    }
  }
}
```

## What it deploys

ArgoCD, Prometheus / Grafana / Loki, Vault + Dex, PostgreSQL clusters with backups, ingress-nginx,
cert-manager, Matrix, Ghost and Uptime Kuma: the core services and the monitoring around them.

## Result

- Infrastructure that used to be clicked together by hand is now code, in one platform any team can plug into.
- The platform is **open source**: [ixofoundation/ixo-terra-infra](https://github.com/ixofoundation/ixo-terra-infra)
  (Apache-2.0).
- Also at ixo: I ran cost comparisons of multi-cloud against an AWS-only setup (**28–36% savings**), and cut
  backup storage costs by **60–80%** with GCS lifecycle policies.
