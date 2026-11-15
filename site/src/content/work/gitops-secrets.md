---
title: GitOps + secrets, from the start
company: ixo · Platform & security
role: DevOps Engineer
period: Feb 2024 – present
order: 2
summary: GitOps with ArgoCD and an image-updater, secrets management on External Secrets Operator + Vault with Dex for OIDC, and locked-down Cloudflare tunnels with no public exposure. Set up greenfield.
tags: [ArgoCD, Image updater, External Secrets Operator, HashiCorp Vault, Dex / OIDC, Cloudflare Tunnels, Grafana, Uptime Kuma]
---

## Context

At ixo, I run the Kubernetes clusters, the ArgoCD deployments and the CI/CD pipelines, and own uptime,
monitoring and incident response for the platform. The workloads include Web3 infrastructure: cross-chain
validator nodes (Hyperlane) and RPC/IPFS endpoints.

There was no GitOps setup before this. I set it up **from the start**, together with secrets management.

## Why

- **Release speed:** new images roll out on their own, without a manual deploy step.
- **Security and audit:** secrets in proper storage, with access control and OIDC login.
- **Drift and reliability:** Git is the source of truth for what's deployed, so the clusters can't quietly
  drift away from it.

## Approach

- **GitOps with ArgoCD:** Git is the source of truth for what runs in the clusters, with an **image-updater**
  for automated image tracking and rollout.
- **Secrets:** set up secrets management on **External Secrets Operator + HashiCorp Vault**, with **Dex**
  handling OIDC auth.
- **Access without exposure:** built and locked down **Cloudflare tunnels** for secure access to databases
  and services, so nothing needed to be publicly exposed.
- **Keeping it up:** uptime and monitoring with **Uptime Kuma** and **Grafana alerting**, and I lead
  incident response for the platform.

## Result

- Deployments track new images and roll out automatically through ArgoCD.
- Secrets live in Vault and reach the clusters through External Secrets Operator, with OIDC auth through Dex.
- Databases and services are reachable through Cloudflare tunnels with no public exposure needed.
