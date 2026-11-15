---
title: GitOps + secrets overhaul
company: ixo · Platform & security
role: DevOps Engineer
period: Feb 2024 – present
order: 2
summary: GitOps with ArgoCD and an image-updater, secrets moved to External Secrets Operator + Vault with Dex for OIDC, and locked-down Cloudflare tunnels with no public exposure.
tags: [ArgoCD, Image updater, External Secrets Operator, HashiCorp Vault, Dex / OIDC, Cloudflare Tunnels, Grafana, Uptime Kuma]
---

## Context

At ixo, Luke runs the Kubernetes clusters, the ArgoCD deployments and the CI/CD pipelines, and owns uptime,
monitoring and incident response for the platform. The workloads include Web3 infrastructure: cross-chain
validator nodes (Hyperlane) and RPC/IPFS endpoints.

> **TODO(Luke):** How were deployments and secrets handled before this work? (Manual `kubectl`/Helm runs? Secrets in CI variables or in the cluster?) What pushed the change?

## Approach

- **GitOps with ArgoCD:** Git is the source of truth for what runs in the clusters, with an **image-updater**
  for automated image tracking and rollout.
- **Secrets:** moved secrets management to **External Secrets Operator + HashiCorp Vault**, with **Dex**
  handling OIDC auth.
- **Access without exposure:** built and locked down **Cloudflare tunnels** for secure access to databases
  and services, so nothing needed to be publicly exposed.
- **Keeping it up:** uptime and monitoring with **Uptime Kuma** and **Grafana alerting**, and Luke leads
  incident response for the platform.

## Result

- Deployments track new images and roll out automatically through ArgoCD.
- Secrets live in Vault and reach the clusters through External Secrets Operator, with OIDC auth through Dex.
- Databases and services are reachable through Cloudflare tunnels with no public exposure needed.

> **TODO(Luke):** Is there a number that shows the change? For example: how many services/apps ArgoCD manages, how many secrets moved to Vault, or how much manual deploy work went away.
