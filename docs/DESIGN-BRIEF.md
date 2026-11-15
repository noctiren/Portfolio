# Design brief

Status: recommendations proposed 2026-11-15, waiting for Luke's picks (OW-STYLE). When Luke answers, record
the choice under each item and mark it **CHOSEN**.

## 1. Overall look
**CHOSEN (Luke 2026-11-15): Shadow & Light** (round 2, A). See DECISIONS D-004 to D-007 for pages and improvements.
**Round 1 REJECTED (Luke 2026-11-15):** A/B/C all "too generic, same as any portfolio".
**Round 2 direction (Luke 2026-11-15):** bolder, "more my style", matching the vibe of his gaming handle
[gaming handle: see .private/forbidden-words.txt]. The handle itself must NOT appear anywhere on the site. Read it as: darkness and shadow, deep and
electric blues, light cutting through dark, stealthy and cinematic, with gaming energy kept professional. Three
bolder variants are being built in `mockups/round2/`. Older notes below are kept for history.
**Luke 2026-11-15: wants visual examples first.** Three static mockups (a/b/c) are being built in `mockups/`; pick after viewing.
Recommended: **"Editorial engineer"**. It carries over the visual identity of Luke's CV: warm off-white paper,
deep green accent, serif headings, clean sans-serif body, monospace for tech tags. The CV and the site then feel
like one brand. Calm and confident, reads as senior.
Alternatives: (b) **Dark terminal / infra console**: near-black, a mono font throughout, green/cyan accents.
On-theme for DevOps but common and harder to read for long. (c) **Minimal Swiss**: white, black, one bright
accent, big sans type. Very clean, less personality.

## 2. Colour (for the recommended look)
- Light: background `#F9F8F4` (paper), text `#1F2A2E`, muted `#5B6670`, accent `#2F5D4E` (deep green), line `#E4E1D8`.
- Dark mode: background `#121816`, text `#E8ECE9`, accent `#7FB8A2`.
- Recommended: light by default, follow the system setting, plus a toggle.

## 3. Type
Serif headings: **Fraunces** (or Newsreader). Body: **Public Sans** (or Inter). Mono: **JetBrains Mono**.
All self-hosted.

## 4. Motion
**CHOSEN, then RAISED (Luke 2026-11-15): "slightly more animations, a bit bolder" + hero infra diagram.** Still respects reduced motion.
Recommended: **subtle**. Sections fade and rise 8px on scroll, links and cards respond on hover, the
experience timeline draws itself in. One **signature piece** in the hero: a small animated infrastructure
diagram (repo → CI → ArgoCD → clusters on AWS/GCP/Vultr) with packets flowing along the lines. It says "platform
engineer" without words. Everything stops under `prefers-reduced-motion`.
Alternatives: none at all (static), or bolder (smooth page transitions, parallax).

## 5. Sections (single page + case-study pages)
1. **Hero**: name, "DevOps / Platform Engineer", one-line pitch, buttons: View work · Download CV · Contact.
2. **About**: short bio from the CV summary ("I'd rather fix the root cause than duct-tape it"), Cape Town,
   gaming. Optional photo (TODO(Luke)).
3. **Impact numbers**: 60–80% backup cost cut · 28–36% multi-cloud savings · 3 clouds · zero-downtime
   migration of every live user.
4. **Case studies** (cards → own page each, problem / approach / result / stack):
   - Multi-cloud Terraform platform (ixo)
   - GitOps + secrets overhaul: ArgoCD, ESO + Vault, Dex, Cloudflare Tunnels (ixo)
   - Identity verification platform: gRPC gateway + domain engine, Spring Batch pipeline (BMTX)
   - Zero-downtime envelope data migration + core banking provider move (envel)
5. **Experience timeline**: like the CV.
6. **Skills**: grouped (Infra & cloud, Platform & security, Reliability, Backend, Web3), shown as mono tags.
   **CHOSEN: list .NET Core lightly under Backend as ".NET Core (familiar)".**
6b. **AI work** (Luke 2026-11-15, wants to signal openness to AI roles): local gen-AI stack + agent tooling. Content draft: `docs/content/ai.md` (needs Luke's confirmation).
7. **Contact**: email, LinkedIn, GitHub (TODO(Luke): link?), CV PDF.

## 6. Extras to consider (each optional)
**CHOSEN (Luke 2026-11-15): "How this site is built" page + GitHub repos.** Not now: blog, /uses. GitHub username still TODO(Luke).
- **"How this site is built"** page: Astro → GitHub Actions → Terraform → Cloudflare Pages, with the
  diagram. Strong for a DevOps portfolio. *Recommended.*
- **GitHub link / pinned repos.** Recommended if Luke has public repos worth showing.
- **Writing / notes** (blog in Markdown): only if Luke will actually write. Can be added later.
- **/uses** page (tools, homelab, setup): a fun, low-effort personal touch.
- **Lighthouse 100 badge**: a quiet flex, checked in CI later.
- **SEO basics**: title/description, Open Graph image (auto-generated card), sitemap. *Always included.*

## Open questions for Luke
1. Overall look: a / b / c?
2. Motion level, and keep the hero infra diagram?
3. Which extras?
4. GitHub username? Photo yes/no? Is .NET Core worth listing?
